import apiService from './axios';

export default {
  getDashboard: () => apiService.post(`/dashboard`),
};
