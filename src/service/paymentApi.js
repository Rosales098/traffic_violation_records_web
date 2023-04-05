import apiService from './axios';

export default {
  getPayments: () => apiService.get(`/payment`),
  getPaymentsUser: (id) => apiService.get(`/payment/${id}`),
  createPayment: (data) => apiService.post(`/create-payment`, data),
};
