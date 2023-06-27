
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    email: null,
    formValue: null,
    googleData: null,
  },
  reducers: {
    saveUserData: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload)); 
    },
    setLogout: (state) => {
      localStorage.removeItem('user');
      localStorage.clear();
      state.user = null;
    },
    resendOTP: (state, action) => {
      state.user = action.payload;
      state.email = action.payload.email;
    },
    register: (state, action) => {
      state.email = action.payload.email;
      state.formValue = action.payload;
    },saveGoogleData: (state, action) => {
      state.googleData = action.payload;
    },
  },
});

export const { saveUserData, setLogout, resendOTP, register, saveEmail, saveGoogleData } = authSlice.actions;

export default authSlice.reducer;

