import api from './api.js';

export const getTasks = (params) => api.get('/tasks', { params }).then((r) => r.data);
export const getStats = () => api.get('/tasks/stats').then((r) => r.data);
export const createTask = (payload) => api.post('/tasks', payload).then((r) => r.data.task);
export const updateTask = (id, payload) => api.put(`/tasks/${id}`, payload).then((r) => r.data.task);
export const updateTaskStatus = (id, status) => api.patch(`/tasks/${id}/status`, { status }).then((r) => r.data.task);
export const deleteTask = (id) => api.delete(`/tasks/${id}`).then((r) => r.data);
