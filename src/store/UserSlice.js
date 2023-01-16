import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    phoneNumber: '',
    dob: '',
    email: '',
    role: '',
    status: '',
  },
};

const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => ({
      ...state,
      user: action.payload,
    }),
  },
});
export const { setUser } = UserSlice.actions;
export default UserSlice.reducer;
