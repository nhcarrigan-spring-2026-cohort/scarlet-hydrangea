

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

export async function apiRequest(path, { headers, ...options } = {}) {
  // Retrieve the access token from localStorage and normalize the HTTP method
  const accessToken = localStorage.getItem("token");
  const method = (options.method || "GET").toUpperCase();

  // Prevent mutations if not signed in, excluding the login endpoint itself which requires a POST to obtain the credentials
  if (method != "GET" && !accessToken && path !== "/api/auth/login") {
    throw new Error("Please sign in.")
  }

  const authHeaders = {};

  // Add Authorization header using the Bearer scheme if the token exists
  if (accessToken) {
    authHeaders["Authorization"] = "Bearer " + accessToken;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...headers,
      ...authHeaders,
    },
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // sometimes error pages are HTML, not JSON
  }

  if (!res.ok) {
    let message =
      (data && (data.error || data.message)) || `HTTP ${res.status} on ${path}`;
    // Specific handling for expired or invalid tokens (401 Unauthorized)
    if (res.status === 401) {
      message = "Session expired, please log in again";
      localStorage.removeItem("token");
    }
    throw new ApiError(message, { status: res.status, data, path });
  }

  return data;
}

// Tool catalog - getTools()
export async function getTools() {
  const data = await apiRequest("/api/tools");

  const tools = Array.isArray(data) ? data : data?.tools;

  if (!Array.isArray(tools)) {
    throw new Error("Unexpected response shape from /api/tools");
  }

  return tools;
}


// getToolById()
export async function getToolById(id) {
  const idStr = String(id);

  const data = await apiRequest(`/api/tools/${idStr}`);

  const tool = data?.tool ?? data;

  if (!tool || String(tool.id) !== idStr) {
    throw new Error(`Tool ${idStr} not found`);
  }

  return tool;
}


// Borrowing
export async function createBorrowRequest(payload) {
  try {
    return await apiRequest("/api/requests", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn("createBorrowRequest: mock success fallback", err);
    return { ok: true, mocked: true };
  }
}

// Borrowed tools by id
export async function getBorrows(id) {
  if (!id) {
    return [];
  }
  try {
    return await apiRequest("/api/borrows/?user_id=" + id);
  } catch (err) {
    console.warn(err);
    throw err;
  }
}



