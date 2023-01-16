import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  category: {
    id: '',
    categoryName: '',
  },
  allCategories: [],
};

const CategoriesSlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setAllCategories: (state, action) => {
      state.allCategories.push(action.payload);
    },
    setCategory: (state, action) => ({
      ...state,
      category: action.payload,
    }),
    removeCategory: (state, action) => ({
      ...state,
      category: {},
    }),
  },
});
export const { setAllCategories, setCategory, removeCategory } = CategoriesSlice.actions;
export default CategoriesSlice.reducer;
