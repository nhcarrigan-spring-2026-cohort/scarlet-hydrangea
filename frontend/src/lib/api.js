import mockTools from "../mock/tools.mock.js";

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
    // sometimes error pages are HTML, not JSON
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
  try {
    const data = await apiRequest("/api/tools");

    // support either: [ ...tools ] OR { tools: [ ...tools ] }
    const tools = Array.isArray(data) ? data : data?.tools;

    if (!Array.isArray(tools)) {
      throw new Error("Unexpected response shape from /api/tools");
    }

    return tools;
  } catch (err) {
    console.warn("getTools: using mockTools fallback", err);
    return mockTools;
  }
}

export async function getToolById(id) {
  const idStr = String(id);

  try {
    const data = await apiRequest(`/api/tools/${idStr}`);

    // support either: { tool: {...} } OR { ...tool }
    const tool = data?.tool ?? data;

    if (!tool || String(tool.id) !== idStr) {
      throw new Error(`Tool ${idStr} not found or response shape changed`);
    }

    return tool;
  } catch (err) {
    console.warn("getToolById: using mockTools fallback", err);

    const tool = mockTools.find((t) => String(t.id) === idStr);
    if (!tool) throw new Error(`Tool ${idStr} not found`);
    return tool;
  }
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





