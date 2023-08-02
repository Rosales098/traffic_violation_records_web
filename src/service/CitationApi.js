import apiService from './axios';

export default {
  getAllCitations: () => apiService.get(`/citation`),
  createCitation: (data) => apiService.post(`/create-citation`, data),
  viewCitation: (id) => apiService.post(`/view-citation/${id}`),
  updateCitation: (id, data) => apiService.put(`/update-citation/${id}`, data),
  deleteCitation: (id) => apiService.post(`/delete-citation/${id}`),
};
