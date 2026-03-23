/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUser, getUserByUserId, updateProfile } from "./authService";
import type { IUser } from "./authTypes";
const initialState: IUser = {
  users: [],
  user: null,
  loading: false,
  error: null,
};

export const getAllUser = createAsyncThunk("auth/fetch", async () => {
  return getUser();
});

export const getSingleUser = createAsyncThunk(
  "auth/fetchUser",
  async (userId?: string) => {
    if (!userId) return;
    return getUserByUserId(userId);
  },
);

export const updateUser = createAsyncThunk(
  "auth/update",
  async ({ id, userData }: { id: string | undefined; userData: any }) => {
    return await updateProfile(id, userData);
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getAllUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(getAllUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message ?? null;
      })

      .addCase(getAllUser.fulfilled, (state, action: any) => {
        state.loading = false;
        state.users = action.payload;
      })

      .addCase(getSingleUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(getSingleUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.error?.message ?? null;
      })

      .addCase(getSingleUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })

      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message ?? null;
      })

      .addCase(updateUser.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export default userSlice.reducer;
