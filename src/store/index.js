import { configureStore } from '@reduxjs/toolkit'
import CategoriesSlice from './CategoriesSlice';
import UserSlice from './UserSlice';
import ViolationSlice from './ViolationSlice';

const store = configureStore({
  reducer: {
    category: CategoriesSlice,
    user: UserSlice,
    violation: ViolationSlice
  }
})

export default store;
