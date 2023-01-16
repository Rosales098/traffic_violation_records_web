import apiService from './axios';

const headersApplicationJSON = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export default {
  getCategory: () => apiService.get(`/category`, {
    headers: headersApplicationJSON,
  }),
  createCategory: (data) => apiService.post(`/create-category`, data),
  updateCategory: (id, data) => apiService.put(`/update-category/${id}`, data),
  deleteCategory: (id) => apiService.post(`/delete-category/${id}`),
};
