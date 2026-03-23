/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  bookCar,
  deleteBooking,
  getAllBooking,
  getAllBookingByUserId,
} from "./bookService";
import type { IBooking } from "../car/carType";

interface bookingStateType {
  userBooking: Array<IBooking>;
  allBookings: Array<IBooking>;
  loading: boolean;
  error: null;
}

const initialState: bookingStateType = {
  userBooking: [],
  allBookings: [],
  loading: false,
  error: null,
};

export const addBooking = createAsyncThunk(
  "bookings/create",
  async ({
    userId,
    bookingData,
  }: {
    userId: string | undefined;
    bookingData: any;
  }) => {
    return bookCar(userId, bookingData);
  },
);

export const getBooking = createAsyncThunk("bookings/get", async () => {
  return getAllBookingByUserId();
});

export const fetchAllBookings = createAsyncThunk("bookings/fetch", async () => {
  return getAllBooking();
});

export const deleteBookingById = createAsyncThunk(
  "bookings/delete",
  async (id?: string) => {
    return deleteBooking(id);
  },
);

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(addBooking.pending, (state) => {
        state.loading = true;
      })

      .addCase(addBooking.rejected, (state) => {
        state.loading = false;
      })

      .addCase(addBooking.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(getBooking.pending, (state) => {
        state.loading = true;
      })

      .addCase(getBooking.rejected, (state) => {
        state.loading = false;
        state.userBooking = [];
      })

      .addCase(getBooking.fulfilled, (state, action: any) => {
        state.loading = false;
        state.userBooking = action.payload;
      })

      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchAllBookings.rejected, (state) => {
        state.loading = false;
        state.allBookings = [];
      })

      .addCase(fetchAllBookings.fulfilled, (state, action: any) => {
        state.loading = false;
        state.allBookings = action.payload;
      })

      .addCase(deleteBookingById.pending, (state) => {
        state.loading = true;
      })

      .addCase(deleteBookingById.rejected, (state) => {
        state.loading = false;
      })

      .addCase(deleteBookingById.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export default bookingSlice.reducer;
