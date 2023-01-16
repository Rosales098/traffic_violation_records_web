import apiService from './axios';

const headersApplicationJSON = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export default {
  login: (data) => apiService.post(`/login`, data),
  logout: () => apiService.post(`/logout`, null),
  getUser: () => apiService.get(`/user`),
  createUser: (data) => apiService.post(`/create-user`, data),
  updateUser: (id, data) => apiService.put(`/update-user/${id}`, data),
  deleteUser: (id) => apiService.post(`/delete-user/${id}`),
  updatePassword: (data) => apiService.post(`/change-password`, data),
};
