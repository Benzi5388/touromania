
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {login:null},
    email: null,
    refresh:false,
    formValue: null,
    googleData: null,
  },
  reducers: {
    saveUserData: (state, action) => {
      state.user = action.payload;
      state.googleData = action.payload;
      console.log(state.user, "user from redux");
      console.log(state.googleData, "user from authslice");
    },
    setLogout: (state) => {
      state.user = null;
      state.googleData = null
    },
    resendOTP: (state, action) => {
      state.user = action.payload;
      state.email = action.payload.email;
    },
    register: (state, action) => {
      state.email = action.payload.email;
      state.formValue = action.payload;
    },updateUser: (state, action) => {
      const { userId } = action.payload;
      const existingUserIndex = state.user.findIndex((user) => user._id === userId);
      if (existingUserIndex !== -1) {
        state.user.splice(existingUserIndex, 1); // Remove the tour from the tours array
      }
    },
    reload:(state,action)=>{
      state.refresh= !state.refresh;
    }
  },
});

export const { saveUserData,reload, setLogout, resendOTP, register, saveEmail, updateUser } = authSlice.actions;

export default authSlice.reducer;

