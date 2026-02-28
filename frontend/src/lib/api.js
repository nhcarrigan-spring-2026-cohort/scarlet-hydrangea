const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000").replace(/\/$/, "");

class ApiError extends Error {
  constructor(message, { status, data, path }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.path = path;
  }
}

function getToken() {
  // Team currently stores token under "token" in Login.jsx
  return localStorage.getItem("token") || localStorage.getItem("access_token");
}

// Fallback helper (no verification) — only used if backend DOESN'T provide /api/borrows/own
function getUserIdFromToken(token) {
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

async function apiRequest(path, { headers, auth = false, ...options } = {}) {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // sometimes error pages are HTML, not JSON
  }

  if (!res.ok) {
    const message =
      (data && (data.error || data.message)) || `HTTP ${res.status} on ${path}`;
    throw new ApiError(message, { status: res.status, data, path });
  }

  return data;
}

// --------------------
// Tools (PUBLIC — no auth header)
// --------------------
export async function getTools() {
  const data = await apiRequest("/api/tools"); // keep exactly like docs
  const tools = Array.isArray(data) ? data : data?.tools;

  if (!Array.isArray(tools)) {
    throw new Error("Unexpected response shape from /api/tools");
  }

  return tools;
}

export async function getToolById(id) {
  const idStr = String(id);
  const data = await apiRequest(`/api/tools/${idStr}`); // keep exactly like docs
  const tool = data?.tool ?? data;

  if (!tool || String(tool.id) !== idStr) {
    throw new Error(`Tool ${idStr} not found`);
  }

  return tool;
}

// --------------------
// Borrows (AUTH REQUIRED)
// --------------------
export async function createBorrowRequest({ item_id }) {
  const itemId = Number(item_id);
  if (!Number.isFinite(itemId)) throw new Error("Missing or invalid item_id");

  // ✅ trailing slash avoids Flask redirect -> preflight/CORS failure
  return await apiRequest("/api/borrows/", {
    method: "POST",
    auth: true,
    body: JSON.stringify({ item_id: itemId }),
  });
}

/**
 * My borrows (AUTH REQUIRED)
 */
export async function getMyBorrows() {
  const token = getToken();
  if (!token) return [];

  // Try /own first (if it exists)
  try {
    return await apiRequest("/api/borrows/own/", { auth: true });
  } catch (err) {
    // fall through
  }

  const userId = getUserIdFromToken(token);
  if (!userId) {
    throw new Error("Could not determine user from token. Please log in again.");
  }

  return await apiRequest(`/api/borrows/?user_id=${userId}`, { auth: true });
}
