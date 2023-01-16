import apiService from './axios';

const headersApplicationJSON = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export default {
  getViolations: () => apiService.get(`/violation`),
  createViolation: (data) => apiService.post(`/create-violation`, data),
  updateViolation: (id, data) => apiService.put(`/update-violation/${id}`, data),
  deleteViolation: (id) => apiService.post(`/delete-violation/${id}`),
};
