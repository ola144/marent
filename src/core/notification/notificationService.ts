/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  equalTo,
  get,
  orderByChild,
  push,
  query,
  ref,
  set,
  update,
} from "firebase/database";
import { rtdb } from "../firebase/firebase.config";
import { toast } from "react-toastify";

export const createNotification = async (notificationData: any) => {
  if (!navigator.onLine) {
    toast.error("No Internet Connection ❌");
    throw new Error("No Internet Connection ❌");
  }

  let userData;

  const localData = localStorage.getItem("marentUser");
  if (localData !== null) {
    userData = JSON.parse(localData);
  }

  const notificationRef = ref(rtdb, "notifications");
  const newNotificationRef = push(notificationRef);

  const payload = {
    id: newNotificationRef.key,
    userId: userData.userId,
    createdAt: new Date().toLocaleString("en-US", {
      year: "2-digit",
      day: "2-digit",
      month: "2-digit",
    }),
    isAdminRead: false,
    isClientRead: false,
    ...notificationData,
  };

  await set(newNotificationRef, payload);
};

export const getAllNotificationByUserId = async () => {
  if (!navigator.onLine) {
    toast.error("No Internet Connection ❌");
    throw new Error("No Internet Connection ❌");
  }

  let userData;

  const localData = localStorage.getItem("marentUser");
  if (localData !== null) {
    userData = JSON.parse(localData);
  }

  const notificationRef = ref(rtdb, "notifications");

  const q = query(
    notificationRef,
    orderByChild("userId"),
    equalTo(userData.userId),
  );

  const snapshot = await get(q);

  if (!snapshot.exists()) return [];

  const data = snapshot.val();

  return Object.keys(data).map((key) => ({
    id: key,
    ...data[key],
  }));
};

export const getAllNotification = async () => {
  if (!navigator.onLine) {
    toast.error("No Internet Connection ❌");
    throw new Error("No Internet Connection ❌");
  }

  const notificationRef = ref(rtdb, "notifications");

  const snapshot = await get(notificationRef);

  if (!snapshot.exists()) return [];

  const data = snapshot.val();

  return Object.keys(data).map((key) => ({
    id: key,
    ...data[key],
  }));
};

export const markAsRead = async (id?: string, status?: any) => {
  if (!navigator.onLine) {
    toast.error("No Internet Connection ❌");
    throw new Error("No Internet Connection ❌");
  }

  const notificationRef = ref(rtdb, `notifications/${id}`);

  await update(notificationRef, status);
};
