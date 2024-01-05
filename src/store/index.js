import { configureStore } from '@reduxjs/toolkit'
import CategoriesSlice from './CategoriesSlice';
import UserSlice from './UserSlice';
import ViolationSlice from './ViolationSlice';
import ServiceTypeSlice from './ServiceTypeSlice';
import VehicleSlice from './VehicleSlice';
import CitationSlice from './CitationSlice';

const store = configureStore({
  reducer: {
    category: CategoriesSlice,
    user: UserSlice,
    violation: ViolationSlice,
    serviceTypes: ServiceTypeSlice,
    vehicle: VehicleSlice,
    citation: CitationSlice
  }
})

export default store;
