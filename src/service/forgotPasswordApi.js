import apiService from './axios';

export default {
  forgotPassword: (payload) => apiService.post(`/forgot-password`, payload),
  resetPassword: (payload) => apiService.post(`/reset-password`, payload),
};
