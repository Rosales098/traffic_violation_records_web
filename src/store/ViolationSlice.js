import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  violation: {
    id: '',
    category_id: '',
    violationName: '',
  },
};

const ViolationSlice = createSlice({
  name: 'violation',
  initialState,
  reducers: {
    setViolation: (state, action) => ({
      ...state,
      violation: action.payload,
    }),
    removeViolation: (state, action) => ({
      ...state,
      violation: {},
    }),
  },
});
export const { setViolation, removeViolation } = ViolationSlice.actions;
export default ViolationSlice.reducer;
