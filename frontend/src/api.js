import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Attach token to every request automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// AUTH
export const register = data => api.post('/auth/register', data);
export const login    = data => api.post('/auth/login', data);

// REPORTS
export const getReports    = ()       => api.get('/reports');
export const getReport     = id       => api.get(`/reports/${id}`);
export const createReport  = formData => api.post('/reports', formData);
export const updateStatus  = (id, status) => api.put(`/reports/${id}`, { status });
export const deleteReport  = id       => api.delete(`/reports/${id}`);

// COMMENTS
export const addComment = (id, body) => api.post(`/reports/${id}/comments`, { body });