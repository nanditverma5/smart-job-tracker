import axios from 'axios';

const API = axios.create({ baseURL: 'https://trackhire-r2ba.onrender.com/api' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);

export const getApplications = () => API.get('/applications');
export const addApplication = (data) => API.post('/applications', data);
export const updateApplication = (id, data) => API.put(`/applications/${id}`, data);
export const deleteApplication = (id) => API.delete(`/applications/${id}`);
export const getStats = () => API.get('/applications/stats');

export const getNotes = (id) => API.get(`/notes/${id}`);
export const addNote = (id, data) => API.post(`/notes/${id}`, data);
export const deleteNote = (id, noteId) => API.delete(`/notes/${id}/${noteId}`);