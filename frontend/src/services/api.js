const API_BASE = '/api';

export const getStoredApiKey = () => {
  return localStorage.getItem('gemini_api_key') || '';
};

export const setStoredApiKey = (key) => {
  if (key) {
    localStorage.setItem('gemini_api_key', key.trim());
  } else {
    localStorage.removeItem('gemini_api_key');
  }
};

const getHeaders = (isJson = true) => {
  const headers = {};
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  const key = getStoredApiKey();
  if (key) {
    headers['X-Gemini-API-Key'] = key;
  }
  return headers;
};

export const api = {
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`, { headers: getHeaders() });
    return res.json();
  },

  async getProjectStats() {
    const res = await fetch(`${API_BASE}/projects/stats`, { headers: getHeaders() });
    return res.json();
  },

  async getSamplePresets() {
    const res = await fetch(`${API_BASE}/samples`, { headers: getHeaders() });
    return res.json();
  },

  async analyzeSafety({ file, preset }) {
    const formData = new FormData();
    if (file) formData.append('file', file);
    if (preset) formData.append('preset', preset);
    
    const key = getStoredApiKey();
    const headers = {};
    if (key) headers['X-Gemini-API-Key'] = key;

    const res = await fetch(`${API_BASE}/safety/analyze`, {
      method: 'POST',
      headers,
      body: formData,
    });
    if (!res.ok) throw new Error(`Safety analysis failed: ${res.statusText}`);
    return res.json();
  },

  async analyzeCrack({ file, preset }) {
    const formData = new FormData();
    if (file) formData.append('file', file);
    if (preset) formData.append('preset', preset);

    const key = getStoredApiKey();
    const headers = {};
    if (key) headers['X-Gemini-API-Key'] = key;

    const res = await fetch(`${API_BASE}/crack/analyze`, {
      method: 'POST',
      headers,
      body: formData,
    });
    if (!res.ok) throw new Error(`Crack analysis failed: ${res.statusText}`);
    return res.json();
  },

  async generateProjectPlan(planInput) {
    const res = await fetch(`${API_BASE}/planning/generate`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(planInput),
    });
    if (!res.ok) throw new Error(`Project planning failed: ${res.statusText}`);
    return res.json();
  },

  async estimateValuation(valInput) {
    const res = await fetch(`${API_BASE}/valuation/estimate`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(valInput),
    });
    if (!res.ok) throw new Error(`Valuation estimation failed: ${res.statusText}`);
    return res.json();
  },

  async getWeatherAdvisory(weatherInput) {
    const res = await fetch(`${API_BASE}/advisory/daily-weather`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(weatherInput),
    });
    if (!res.ok) throw new Error(`Weather advisory failed: ${res.statusText}`);
    return res.json();
  },

  async chatAssistant(messages) {
    const res = await fetch(`${API_BASE}/assistant/chat`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ messages }),
    });
    if (!res.ok) throw new Error(`Assistant query failed: ${res.statusText}`);
    return res.json();
  }
};
