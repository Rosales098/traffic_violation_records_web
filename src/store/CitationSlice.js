import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const initialState = {
  violations: [],
  violator: {},
  license: {},
  vehicle: {},
  placeAndDate: {},
  withLicense: true,
  withPlate: true,
  registered: true,
  vehicles: [],
  selectedViolator: null,
};

const CitationSlice = createSlice({
  name: 'citation',
  initialState,
  reducers: {
    setViolations: (state, action) => {
      const inArray = state.violations.some((obj) => obj.id === action.payload.id);
      console.log(inArray);
      if (inArray) {
        toast.error('Violation is already added.');
        return;
      }
      state.violations.push(action.payload);
    },
    // eslint-disable-next-line arrow-body-style
    removeAViolation: (state, action) => {
      return {
        ...state,
        violations: state.violations.filter((obj) => obj.id !== action.payload),
      };
    },
    removeViolations: (state) => ({
      ...state,
      violations: [],
    }),
    setViolator: (state, action) => ({
      ...state,
      violator: action.payload,
    }),
    setLicense: (state, action) => ({
      ...state,
      license: action.payload,
    }),
    setVehicle: (state, action) => ({
      ...state,
      vehicle: action.payload,
    }),
    setPlaceAndDate: (state, action) => ({
      ...state,
      placeAndDate: action.payload,
    }),
    setWithLicense: (state, action) => ({
      ...state,
      withLicense: action.payload,
    }),
    setWithPlate: (state, action) => ({
      ...state,
      withPlate: action.payload,
    }),
    setRegistered: (state, action) => ({
      ...state,
      registered: action.payload,
    }),
    setVehicles: (state, action) => ({
      ...state,
      vehicles: action.payload,
    }),
    setSelectedViolator: (state, action) => ({
      ...state,
      selectedViolator: action.payload,
    }),
  },
});
export const {
  setViolations,
  removeAViolation,
  removeViolations,
  setViolator,
  setLicense,
  setVehicle,
  setPlaceAndDate,
  setWithLicense,
  setWithPlate,
  setRegistered,
  setVehicles,
  setSelectedViolator,
} = CitationSlice.actions;
export default CitationSlice.reducer;
