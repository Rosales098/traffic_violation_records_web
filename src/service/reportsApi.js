import apiService from './axios';

export default {
  getIncomeReports: (payload) => apiService.post(`/reports/income`, payload),
  getIncomeReportsUser: (id, payload) => apiService.post(`/reports/income/${id}`, payload),
};
