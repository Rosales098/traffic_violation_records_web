import apiService from './axios';

const headersApplicationJSON = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export default {
  getAllInvoices: () => apiService.get(`/invoices`),
  viewInvoice: (id) => apiService.post(`/invoice/view${id}`),
  updateCitation: (id, data) => apiService.put(`/update-citation/${id}`, data),
  deleteCitation: (id) => apiService.post(`/delete-citation/${id}`),
};
