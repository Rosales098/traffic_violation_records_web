import apiService from './axios';

export default {
  getAllViolators: () => apiService.get(`/violator`),
};
