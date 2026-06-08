const API_BASE = import.meta.env.VITE_API_URL || '';

async function parseResponse(res) {
  if (res.status === 204) return null;

  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function apiRequest(path, options = {}) {
  const { body, headers, ...rest } = options;

  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    credentials: 'include',
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await parseResponse(res);

  if (!res.ok) {
    const error = new Error(data?.message || 'Request failed');
    error.status = res.status;
    error.details = data?.details;
    throw error;
  }

  return data;
}

export const authApi = {
  register: (payload) =>
    apiRequest('/api/v1/auth/register', { method: 'POST', body: payload }),
  login: (payload) =>
    apiRequest('/api/v1/auth/login', { method: 'POST', body: payload }),
  logout: () => apiRequest('/api/v1/auth/logout', { method: 'POST' }),
  me: () => apiRequest('/api/v1/auth/me'),
};

export const tasksApi = {
  list: () => apiRequest('/api/v1/tasks'),
  create: (payload) =>
    apiRequest('/api/v1/tasks', { method: 'POST', body: payload }),
  update: (id, payload) =>
    apiRequest(`/api/v1/tasks/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => apiRequest(`/api/v1/tasks/${id}`, { method: 'DELETE' }),
};
