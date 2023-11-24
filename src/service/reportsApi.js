import apiService from './axios';

export default {
  getIncomeReports: (payload) => apiService.post(`/reports/income`, payload),
  getIncomeReportsUser: (id, payload) => apiService.post(`/reports/income/${id}`, payload),
  getViolationReports: (payload) => apiService.post(`/reports/violation`, payload),
  getTopCommittedViolations: (payload) => apiService.post(`/reports/top`, payload),
  getUnsettled: (payload) => apiService.post(`/reports/unsettled`, payload)
};
