const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, { status, data, path }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.path = path;
  }
}


export function getToken() {
  // Some older branches used "access_token" — support both.
  return localStorage.getItem("token") || localStorage.getItem("access_token");
}

// Only used if backend does NOT provide /api/borrows/own.
function decodeJwtUserId(token) {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;

    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const data = JSON.parse(json);

    return data.sub ?? data.user_id ?? data.id ?? null;
  } catch {
    return null;
  }
}

// Safely parse JSON if present, otherwise null.
async function safeParseJson(res) {
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return null;

  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function apiRequest(path, { headers = {}, auth = false, ...options } = {}) {
  const token = getToken();
  const method = (options.method || "GET").toUpperCase();

  // Prevent mutations if not signed in, excluding the login and users endpoints which requires a POST to obtain the credentials
  if ((method !== "GET" || auth) && !token && path !== "/api/auth/login" && path !== "/api/users") {
    throw new Error("Please log in to request a borrow.");
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const data = await safeParseJson(res);

  if (!res.ok) {
    let message =
      data?.error ||
      data?.message ||
      data?.detail ||
      `HTTP ${res.status} on ${path}`;

    // Specific handling for expired or invalid tokens (401 Unauthorized)
    if (res.status === 401 || res.status === 422) {
      message = "Session expired, please log in again";
      localStorage.removeItem("token");
      localStorage.removeItem("access_token");

    }
    throw new ApiError(message, { status: res.status, data, path });
  }

  return data;
}

/**
 * Flask may redirect based on trailing slash.
 * Redirects break CORS preflight when Authorization header triggers OPTIONS.
 * This helper tries the given path and, if the browser reports "Failed to fetch",
 * retries once with the opposite trailing-slash variant.
 */
async function apiRequestTryBothSlashes(path, options) {
  try {
    return await apiRequest(path, options);
  } catch (err) {
    const msg = String(err?.message || "").toLowerCase();
    const isFetchFailure = msg.includes("failed to fetch");

    // Only retry on the browser-level fetch failure case (CORS/preflight/redirect)
    if (!isFetchFailure) throw err;

    const alt = path.endsWith("/") ? path.slice(0, -1) : `${path}/`;
    return await apiRequest(alt, options);
  }
}

/* =========================
   Tools (PUBLIC)
========================= */

export async function getTools() {
  const data = await apiRequest("/api/tools");
  const tools = Array.isArray(data) ? data : data?.tools;

  if (!Array.isArray(tools)) {
    throw new Error("Unexpected response shape from /api/tools");
  }

  return tools;
}

export async function getToolById(id) {
  const idStr = String(id);

  const data = await apiRequest(`/api/tools/${idStr}`);
  const tool = data?.tool ?? data;

  if (!tool || String(tool.id) !== idStr) {
    throw new Error(`Tool ${idStr} not found`);
  }

  return tool;
}

/* =========================
   Users (PUBLIC)
========================= */

export async function registerUser(payload) {
  // payload: { email, username, full_name, password }
  return await apiRequest("/api/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/* =========================
   Borrows (AUTH)
========================= */

export async function createBorrowRequest(payload) {
  const rawId =
    payload?.item_id ??
    payload?.tool_id ??
    payload?.id ??
    payload?.itemId ??
    payload?.toolId;

  const idNum = Number(rawId);
  if (!Number.isFinite(idNum)) {
    throw new Error("Missing or invalid tool/item id");
  }

  // POST often triggers preflight because of Authorization header.
  // Use tryBothSlashes to avoid Flask redirect preflight failure.
  return await apiRequestTryBothSlashes("/api/borrows/", {
    method: "POST",
    auth: true,
    body: JSON.stringify({ item_id: idNum }),
  });
}

// Borrowed tools by user id (if still used anywhere)
export async function getBorrows(userId) {
  if (!userId) return [];

  // Some backends prefer /api/borrows/?user_id=..., so try both if needed.
  const pathNoSlash = `/api/borrows?user_id=${encodeURIComponent(userId)}`;
  const pathWithSlash = `/api/borrows/?user_id=${encodeURIComponent(userId)}`;

  try {
    return await apiRequest(pathNoSlash, { auth: true });
  } catch (err) {
    const msg = String(err?.message || "").toLowerCase();
    if (msg.includes("failed to fetch")) {
      return await apiRequest(pathWithSlash, { auth: true });
    }
    throw err;
  }
}

// Preferred: logged-in user's borrows.
export async function getMyBorrows() {
  const token = getToken();
  if (!token) return [];

  // Try both /own and /own/ to avoid preflight redirect issues.
  try {
    return await apiRequestTryBothSlashes("/api/borrows/own/", { auth: true });
  } catch {
    // fallback
  }

  // Fallback: decode user id and query
  const userId = decodeJwtUserId(token);
  if (!userId) {
    throw new Error("Could not determine user from token. Please log in again.");
  }

  const pathNoSlash = `/api/borrows?user_id=${encodeURIComponent(userId)}`;
  const pathWithSlash = `/api/borrows/?user_id=${encodeURIComponent(userId)}`;

  try {
    return await apiRequest(pathNoSlash, { auth: true });
  } catch (err) {
    const msg = String(err?.message || "").toLowerCase();
    if (msg.includes("failed to fetch")) {
      return await apiRequest(pathWithSlash, { auth: true });
    }
    throw err;
  }
}

/* =========================
   Admin borrows (AUTH)
========================= */

export async function getAllBorrows() {
  // GET can still preflight if Authorization header is present.
  // Try both /api/borrows and /api/borrows/ to avoid redirect preflight failures.
  return await apiRequestTryBothSlashes("/api/borrows", { auth: true });
}