import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  serviceType: {
    id: '',
    service_name: '',
    discount: '',
    time_to_render: '',
  },
};

const ServiceTypeSlice = createSlice({
  name: 'serviceType',
  initialState,
  reducers: {
    setServiceType: (state, action) => ({
      ...state,
      serviceType: action.payload,
    }),
  },
});
export const { setServiceType } = ServiceTypeSlice.actions;
export default ServiceTypeSlice.reducer;
