/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAllNotification,
  getAllNotificationByUserId,
  markAsRead,
} from "./notificationService";
import type { INotification } from "../auth/authTypes";

interface NotificationState {
  allNotifications: Array<INotification>;
  userNotifications: Array<INotification>;
  loading: boolean;
  error: null | string;
}

const initialState: NotificationState = {
  allNotifications: [],
  userNotifications: [],
  loading: false,
  error: null,
};

export const fetchAllNotifications = createAsyncThunk(
  "notification/fetch",
  async () => {
    return getAllNotification();
  },
);

export const getUserNotifications = createAsyncThunk(
  "notification/get",
  async () => {
    return getAllNotificationByUserId();
  },
);

export const markNotAsRead = createAsyncThunk(
  "notification/update",
  async ({ id, status }: { id?: string; status: any }) => {
    return markAsRead(id, status);
  },
);

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.allNotifications = action.payload;
      })
      .addCase(fetchAllNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      })
      .addCase(getUserNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.userNotifications = action.payload;
      })
      .addCase(getUserNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      })
      .addCase(markNotAsRead.pending, (state) => {
        state.loading = true;
      })
      .addCase(markNotAsRead.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(markNotAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      });
  },
});

export default notificationSlice.reducer;
