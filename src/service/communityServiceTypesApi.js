import apiService from './axios';

const headersApplicationJSON = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export default {
  getAllCommunityServicesTypes: () => apiService.get(`/community-service-types`),
  createCommunityServicesTypes: (data) => apiService.post(`/community-service-types/create`, data),
  viewCommunityServicesTypes: (id) => apiService.post(`/community-service-types/view/${id}`),
  updateCommunityServicesTypes: (id, data) => apiService.put(`/community-service-types/update/${id}`, data),
  deleteCommunityServicesTypes: (id) => apiService.post(`/community-service-types/delete/${id}`),
};
