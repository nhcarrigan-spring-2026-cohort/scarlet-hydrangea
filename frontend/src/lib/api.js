const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:5000";

class ApiError extends Error {
  constructor(message, { status, data, path }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.path = path;
  }
}

async function apiRequest(path, { headers, ...options } = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // Some errors (proxies, HTML error pages) can return non-JSON.
    // Keep `data` as null so the fallback message below is still useful.
  }

  if (!res.ok) {
    const message =
      (data && (data.error || data.message)) || `HTTP ${res.status} on ${path}`;
    throw new ApiError(message, { status: res.status, data, path });
  }

  return data;
}

// Tool catalog
export async function getTools() {
  const data = await apiRequest("/api/tools");

  if (!data || !Array.isArray(data.tools)) {
    throw new Error("Unexpected response shape from /api/tools");
  }

  return data.tools;
}

export async function getToolById(id) {
  const data = await apiRequest(`/api/tools/${id}`);

  if (!data || !data.tool) {
    throw new Error(`Tool ${id} not found or response shape changed`);
  }

  return data.tool;
}

// Borrowing
export async function createBorrowRequest(payload) {
  return apiRequest("/api/requests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

