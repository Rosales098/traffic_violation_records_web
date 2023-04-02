import apiService from './axios';

export default {
  getPayments: () => apiService.get(`/payment`),
  createPayment: (data) => apiService.post(`/create-payment`, data),
};
