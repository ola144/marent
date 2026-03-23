/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  equalTo,
  get,
  orderByChild,
  push,
  query,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import { rtdb } from "../firebase/firebase.config";
import { createNotification } from "../notification/notificationService";
import { getUserNotifications } from "../notification/notificationSlice";
import { useAppDispatch } from "../../hooks";

export let bookingCarId: any;

export const bookCar = async (userId: string | undefined, bookData: any) => {
  if (!navigator.onLine) {
    throw new Error("No Internet Connection");
  }

  let userData: any;

  const localData = localStorage.getItem("marentUser");
  if (localData !== null) {
    userData = JSON.parse(localData);
  }

  const bookRef = ref(rtdb, "bookings");

  const newBookRef = push(bookRef);

  const payload = {
    id: newBookRef.key,
    userId: userId,
    ...bookData,
  };

  await set(newBookRef, payload).then(() => {
    const dispatch = useAppDispatch();

    const notPayload = {
      type: "Booking",
      adminMsg: `${userData.firstName} ${userData.lastName} has booked for a new car.`,
      clientMsg: `You just booked for car. Await response from marent admin.`,
      ...bookData,
    };

    createNotification(notPayload).then(() => {
      dispatch(getUserNotifications());
    });
  });

  bookingCarId = newBookRef.key;
};

export const updateBooking = async (id: string, bookData: any) => {
  if (!navigator.onLine) {
    throw new Error("No Internet Conntection");
  }

  const bookRef = ref(rtdb, `bookings/${id}`);

  await update(bookRef, bookData);
};

export const deleteBooking = async (id?: string) => {
  const bookRef = ref(rtdb, `bookings/${id}`);

  await remove(bookRef);
};

export const getAllBookingByUserId = async () => {
  if (!navigator.onLine) {
    throw new Error("No Internet Conntection");
  }

  let userData;

  const localData = localStorage.getItem("marentUser");
  if (localData !== null) {
    userData = JSON.parse(localData);
  }

  if (userData.userId) {
    const bookRef = ref(rtdb, "bookings");

    const q = query(bookRef, orderByChild("userId"), equalTo(userData.userId));

    const snapshot = await get(q);

    if (!snapshot.exists()) return [];

    const data = snapshot.val();

    return Object.keys(data).map((key) => ({
      id: key,
      ...data[key],
    }));
  }
};

export const getAllBooking = async () => {
  if (!navigator.onLine) {
    throw new Error("No Internet Conntection");
  }

  const bookRef = ref(rtdb, "bookings");

  const snapshot = await get(bookRef);

  if (!snapshot.exists()) return [];

  const data = snapshot.val();

  return Object.keys(data).map((key) => ({
    id: key,
    ...data[key],
  }));
};
