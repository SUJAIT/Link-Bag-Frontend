import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

export const getLinks = () => api.get('/api/links').then(res => res.data);
export const addLink = (payload) => api.post('/api/links', payload).then(res => res.data);
export const deleteLink = (id) => api.delete(`/api/links/${id}`).then(res => res.data);

export default api;
