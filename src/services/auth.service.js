import api from './api';

const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getMe: () => api.get('/users/me'),
  logout: () => api.post('/auth/logout'),
};

export default authService;
