import apiService from './axios';

const headersApplicationJSON = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export default {
  getAllCommunityServices: () => apiService.get(`/community-service`),
  createCommunityServices: (data) => apiService.post(`/community-service/create`, data),
  viewCommunityServices: (id) => apiService.post(`/community-service/view/${id}`),
  updateCommunityServices: (id, data) => apiService.put(`/community-service/update/${id}`, data),
  deleteCommunityServices: (id) => apiService.post(`/community-service/delete/${id}`),
};
