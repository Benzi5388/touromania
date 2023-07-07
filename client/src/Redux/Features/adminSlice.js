import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    user: null,
    error: null,
    loading: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
      localStorage.setItem("admin", JSON.stringify(action.payload));
    },
    setLogout: (state) => {
      localStorage.clear();
      state.user = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('admin');
      document.cookie = 'admin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';



    },
  },
  extraReducers: {},
});

export const { setUser, setLogout } = adminSlice.actions;

export default adminSlice.reducer;

