const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000"
).replace(/\/$/, "");

class ApiError extends Error {
  constructor(message, { status, data, path }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.path = path;
  }
}

async function apiRequest(path, { headers = {}, ...options } = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
  });

  if (!res.ok) {
    let data = null;

    try {
      data = await res.json();
    } catch {}

    throw new ApiError(data?.error || `HTTP ${res.status}`, {
      status: res.status,
      data,
      path,
    });
  }

  return res.json();
}

export async function getAllBorrows() {
  return await apiRequest("/api/borrows/");
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
