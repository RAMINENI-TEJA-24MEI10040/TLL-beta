const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

async function fetchApi(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    
    // Parse JSON safely
    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }

    if (!response.ok) {
      const errorMessage = data?.detail || data?.message || `API Error: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error(`API Client Error [${endpoint}]:`, error);
    throw error;
  }
}

export const apiClient = {
  // Targets
  getTargets: () => fetchApi('/targets'),
  getTarget: (id) => fetchApi(`/targets/${id}`),
  createTarget: (payload) => fetchApi('/targets', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  deleteTarget: (id) => fetchApi(`/targets/${id}`, {
    method: 'DELETE',
  }),
  triggerScan: (id) => fetchApi(`/targets/${id}/scan`, {
    method: 'POST',
  }),

  // Analyzers & Engines
  analyzeJwt: (token) => fetchApi('/jwt/analyze', {
    method: 'POST',
    body: JSON.stringify({ token }),
  }),
  runBolaCheck: (url, auth_token) => fetchApi('/security/bola', {
    method: 'POST',
    body: JSON.stringify({ url, auth_token }),
  }),
  runRbacCheck: (url, tokens) => fetchApi('/security/rbac', {
    method: 'POST',
    body: JSON.stringify({ url, tokens }),
  }),
  runLoadTest: (url, rps, duration_sec) => fetchApi('/security/loadtest', {
    method: 'POST',
    body: JSON.stringify({ url, rps, duration_sec }),
  }),
  downloadPdf: async (targetId) => {
    const url = `${BASE_URL}/targets/${targetId}/report/pdf`;
    const response = await fetch(url);
    
    if (!response.ok) {
      let errorMessage = `API Error: ${response.status}`;
      try {
        const errData = await response.json();
        errorMessage = errData.detail || errorMessage;
      } catch (e) {
        // Not JSON
      }
      throw new Error(errorMessage);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const errData = await response.json();
      throw new Error(errData.detail || "Unexpected JSON response instead of PDF");
    }
    
    return await response.blob();
  }
};
