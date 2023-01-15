import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  citedViolations: [],
  driversInfo: {
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    address: '',
    nationality: '',
    phoneNumber: '',
    dob: '',
    licenseNumber: '',
    licenseType: '',
    licenseStatus: '',
    vehicleType: '',
    plateNumber: '',
    color: '',
    class: '',
    bodyMarkings: '',
    registeredOwner: '',
    ownerAddress: '',
    vehicleStatus: '',
  },
  citationDetails: {
    violationDate: '',
    violationTime: '',
    municipality: '',
    zipCode: '',
    barangay: '',
    street: '',
  }
};

const ViolationCategoriesSlice = createSlice({
  name: 'citation',
  initialState,
  reducers: {
    addViolation: (state, action) => {
      state.citedViolations.push(action.payload);
    },
    removeViolation: (state, action) => {
      const index = state.citedViolations.indexOf(action.payload);
      if (index > -1) {
        // only splice array when item is found
        state.citedViolations.splice(index, 1); // 2nd parameter means remove one item only
        
      }
    },
    setDriversInfo: (state, action) => {
      return {
        ...state,
        driversInfo: action.payload,
      }
    },
    setCitationDetails: (state, action) => {
      state.citedViolations.push(action.payload);
    },
  },
});
export const {addViolation, removeViolation, setDriversInfo, setCitationDetails} = ViolationCategoriesSlice.actions;
export default ViolationCategoriesSlice.reducer;
