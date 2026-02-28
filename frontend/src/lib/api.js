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

// Some older branches used "access_token" — support both.
function getToken() {
  return localStorage.getItem("token") || localStorage.getItem("access_token");
}

// Only used if backend does NOT provide /api/borrows/own/.
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

async function apiRequest(path, { headers = {}, auth = false, ...options } = {}) {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const data = await safeParseJson(res);

  if (!res.ok) {
    const message =
      data?.error ||
      data?.message ||
      data?.detail ||
      `HTTP ${res.status} on ${path}`;

    throw new ApiError(message, { status: res.status, data, path });
  }

  return data;
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
   Auth (optional helpers)
   Borrows (AUTH)
========================= */

export async function createBorrowRequest({ item_id }) {
  const itemId = Number(item_id);
  if (!Number.isFinite(itemId)) {
    throw new Error("Missing or invalid item_id");
  }

  return await apiRequest("/api/borrows/", {
    method: "POST",
    auth: true,
    body: JSON.stringify({ item_id: itemId }),
  });
}

export async function getBorrows(userId) {
  if (!userId) return [];

  return await apiRequest(`/api/borrows/?user_id=${encodeURIComponent(userId)}`, {
    auth: true,
  });
}

// Preferred: logged-in user's borrows.
export async function getMyBorrows() {
  const token = getToken();
  if (!token) return [];

  // 1) Preferred endpoint
  try {
    return await apiRequest("/api/borrows/own/", { auth: true });
  } catch {
    // fallback
  }

  // 2) Fallback
  const userId = decodeJwtUserId(token);
  if (!userId) {
    throw new Error("Could not determine user from token. Please log in again.");
  }

  return await apiRequest(`/api/borrows/?user_id=${encodeURIComponent(userId)}`, {
    auth: true,
  });
}
