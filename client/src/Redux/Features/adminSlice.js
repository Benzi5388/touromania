import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    user: {login:null},
    error: null,
    loading: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      console.log(action.payload, "admin payload");
      state.loading = false;
      state.error = null;
    },
    setLogout: (state) => {
      // localStorage.clear();
      // state.user = null;
      // state.loading = false;
      // state.error = null;
      // document.cookie = 'admin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      state.user = null;
    },
  },
  extraReducers: {},
});

export const { setUser, setLogout } = adminSlice.actions;

export default adminSlice.reducer;

