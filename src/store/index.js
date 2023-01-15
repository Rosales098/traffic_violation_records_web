import { configureStore } from '@reduxjs/toolkit'
import ViolationCategoriesSlice from './violation-categories';

const store = configureStore({
  reducer: {
    violationCategories: ViolationCategoriesSlice
  }
})

export default store;
