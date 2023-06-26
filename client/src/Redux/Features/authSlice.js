
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    email: null,
    formValue: null
  },
  reducers: {
    saveUserData: (state, action) => {
      state.user = action.payload;
    },
    setLogout: (state) => {
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
    }
  },
});

export const { saveUserData, setLogout, resendOTP, register, saveEmail } = authSlice.actions;

export default authSlice.reducer;

