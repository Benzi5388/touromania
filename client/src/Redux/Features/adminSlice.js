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
    },
  },
  extraReducers: {},
});

export const { setUser, setLogout } = adminSlice.actions;

export default adminSlice.reducer;

