import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./core/auth/authSlice";
import userSlice from "./core/auth/userSlice";
import carSlice from "./core/car/carSlice";
import wishlistSlice from "./core/wishlist/wishlistSlice";
import bookingSlice from "./core/booked/bookSlice";
import taskSlice from "./core/task/taskSlice";
import contactSlice from "./core/contact/contactSlice";
import notificationSlice from "./core/notification/notificationSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    users: userSlice,
    cars: carSlice,
    wishlist: wishlistSlice,
    bookings: bookingSlice,
    task: taskSlice,
    contact: contactSlice,
    notification: notificationSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
