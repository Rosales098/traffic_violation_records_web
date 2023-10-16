import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  vehicleMake: {
    id: '',
    make: '',
  },
  vehicleClass: {
    id: '',
    classes: '',
  },
};

const VehicleSliceAction = createSlice({
  name: 'vehicle',
  initialState,
  reducers: {
    setVehicleMake: (state, action) => ({
      ...state,
      vehicleMake: action.payload,
    }),
    removeVehicleMake: (state, action) => ({
      ...state,
      vehicleMake: { id: '', make: '' },
    }),
    setVehicleClass: (state, action) => ({
      ...state,
      vehicleClass: action.payload,
    }),
    removeVehicleClass: (state, action) => ({
      ...state,
      vehicleClass: { id: '', classes: '' },
    }),
  },
});
export const { setVehicleMake, removeVehicleMake, setVehicleClass,  removeVehicleClass} = VehicleSliceAction.actions;
export default VehicleSliceAction.reducer;
