import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOnline: true,
  loading: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setOffline: (state) => {
      state.isOnline = false;
      state.loading = false;
    },
    setOnline: (state) => {
      state.isOnline = true;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setOffline, setOnline, setLoading } = appSlice.actions;
export default appSlice.reducer;
