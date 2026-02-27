<<<<<<< Updated upstream
import mockTools from "../mock/tools.mock.js";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000").replace(
  /\/$/,
  ""
);
=======
const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000").replace(/\/$/, "");
>>>>>>> Stashed changes

class ApiError extends Error {
  constructor(message, { status, data, path }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.path = path;
  }
}

<<<<<<< Updated upstream
// Convert backend tool shape -> frontend-friendly tool shape
=======
function getAccessToken() {
  return localStorage.getItem("access_token");
}

// Best-effort decode (no validation) to pull user id from JWT payload.
// This is enough for local dev to call /api/borrows?user_id
function getUserIdFromToken(token) {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;

    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const data = JSON.parse(json);

    // common claim names:
    return data.sub ?? data.user_id ?? data.id ?? null;
  } catch {
    return null;
  }
}

/**
 * Normalize backend tool shape -> frontend-friendly shape.
 * Backend returns: is_available, available_quantity
 * Frontend expects: available (boolean)
 */
>>>>>>> Stashed changes
function normalizeTool(tool) {
  if (!tool || typeof tool !== "object") return tool;

  const available =
    typeof tool.available === "boolean"
      ? tool.available
      : typeof tool.is_available === "boolean"
      ? tool.is_available
      : typeof tool.available_quantity === "number"
      ? tool.available_quantity > 0
      : false;

  return { ...tool, available };
}

async function apiRequest(path, { headers, ...options } = {}) {
  const token = getAccessToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    const message = (data && (data.error || data.message)) || `HTTP ${res.status} on ${path}`;
    throw new ApiError(message, { status: res.status, data, path });
  }

  return data;
}

<<<<<<< Updated upstream
// Tool catalog
=======
/**
 * Auth
 * POST /api/auth/login
 * body: { email, password }
 * returns: { access_token }
 */
export async function login({ email, password }) {
  const data = await apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  const token = data?.access_token;
  if (!token) {
    throw new Error("Login succeeded but no access_token returned.");
  }

  localStorage.setItem("access_token", token);
  return token;
}

// local-only logout (backend logout endpoint may be added later)
export function logoutLocal() {
  localStorage.removeItem("access_token");
}

// Tool catalog - getTools()
>>>>>>> Stashed changes
export async function getTools() {
  try {
    const data = await apiRequest("/api/tools");

    // support either: [ ...tools ] OR { tools: [ ...tools ] }
    const tools = Array.isArray(data) ? data : data?.tools;

    if (!Array.isArray(tools)) {
      throw new Error("Unexpected response shape from /api/tools");
    }

    return tools.map(normalizeTool);
  } catch (err) {
    console.warn("getTools: using mockTools fallback", err);
    return mockTools.map(normalizeTool);
  }
<<<<<<< Updated upstream
}

=======

  return tools.map(normalizeTool);
}

// getToolById()
>>>>>>> Stashed changes
export async function getToolById(id) {
  const idStr = String(id);

  try {
    const data = await apiRequest(`/api/tools/${idStr}`);

    // support either: { tool: {...} } OR { ...tool }
    const tool = data?.tool ?? data;

    if (!tool || String(tool.id) !== idStr) {
      throw new Error(`Tool ${idStr} not found or response shape changed`);
    }

    return normalizeTool(tool);
  } catch (err) {
    console.warn("getToolById: using mockTools fallback", err);

    const tool = mockTools.find((t) => String(t.id) === idStr);
    if (!tool) throw new Error(`Tool ${idStr} not found`);
    return normalizeTool(tool);
  }
<<<<<<< Updated upstream
}

// Borrowing
export async function createBorrowRequest(payload) {
  return await apiRequest("/api/borrows/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
=======

  return normalizeTool(tool);
}

/**
 * Borrowing
 * POST /api/borrows
 * Headers: Authorization: Bearer <access_token>
 * body: { item_id }
 */
export async function createBorrowRequest({ item_id }) {
  return await apiRequest("/api/borrows/", {
    method: "POST",
    body: JSON.stringify({ item_id }),
  });
}

/**
 * Borrows list (legacy function name kept)
 * If id is provided, hits /api/borrows?user_id=<id>
 * If id is not provided, tries to infer from token.
 */
export async function getBorrows(id) {
  const token = getAccessToken();
  if (!token) return [];

  let userId = id;
  if (!userId) {
    userId = getUserIdFromToken(token);
  }

  if (userId != null) {
    return await apiRequest(`/api/borrows/?user_id=${userId}`);
  }

  // Fallback: may be admin-only later
  return await apiRequest("/api/borrows/");
>>>>>>> Stashed changes
}