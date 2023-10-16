import apiService from './axios';

// const headersApplicationJSON = {
//   Accept: 'application/json',
//   'Content-Type': 'application/json',
// };

export default {
  getMake: () => apiService.get(`/make`),
  createMake: (data) => apiService.post(`/make/create`, data),
  updateMake: (id, data) => apiService.put(`/make/update/${id}`, data),
  deleteMake: (id) => apiService.post(`/make/delete/${id}`),

  getClass: () => apiService.get(`/class`),
  createClass: (data) => apiService.post(`/class/create`, data),
  updateClass: (id, data) => apiService.put(`/class/update/${id}`, data),
  deleteClass: (id) => apiService.post(`/class/delete/${id}`),
};
