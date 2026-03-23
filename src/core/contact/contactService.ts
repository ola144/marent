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
import { createNotification } from "../notification/notificationService";
import { toast } from "react-toastify";

export const createContact = async (contactData: any) => {
  if (!navigator.onLine) {
    toast.error("No Internet Connection ❌");
    throw new Error("No Internet Connection ❌");
  }

  let userData: any;

  const localData = localStorage.getItem("marentUser");
  if (localData !== null) {
    userData = JSON.parse(localData);
  }

  const contactRef = ref(rtdb, "contacts");
  const newContactRef = push(contactRef);

  const payload = {
    id: newContactRef.key,
    createdDate: new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "numeric",
    }),
    userId: userData.userId,
    ...contactData,
  };

  await set(newContactRef, payload).then(() => {
    const notPayload = {
      type: "Contact",
      adminMsg: `${userData.firstName} ${userData.lastName} has sent a feedback.`,
      clientMsg: `You just sent a feedback to marent admin.`,
      ...contactData,
    };

    createNotification(notPayload);
  });
};

export const getAllContactByUserId = async () => {
  if (!navigator.onLine) {
    toast.error("No Internet Connection ❌");
    throw new Error("No Internet Connection ❌");
  }

  let userData;

  const localData = localStorage.getItem("marentUser");
  if (localData !== null) {
    userData = JSON.parse(localData);
  }

  const contactRef = ref(rtdb, "contacts");

  const q = query(contactRef, orderByChild("userId"), equalTo(userData.userId));

  const snapshot = await get(q);

  if (!snapshot.exists()) return [];

  const data = snapshot.val();

  return Object.keys(data).map((key) => ({
    id: key,
    ...data[key],
  }));
};

export const getAllContact = async () => {
  if (!navigator.onLine) {
    toast.error("No Internet Connection ❌");
    throw new Error("No Internet Connection ❌");
  }

  const contactRef = ref(rtdb, "contacts");

  const snapshot = await get(contactRef);

  if (!snapshot.exists()) return [];

  const data = snapshot.val();

  return Object.keys(data).map((key) => ({
    id: key,
    ...data[key],
  }));
};

export const updateContact = async (
  id: string | undefined,
  updateContact: any,
) => {
  if (!navigator.onLine) {
    toast.error("No Internet Connection ❌");
    throw new Error("No Internet Connection ❌");
  }

  const contactRef = ref(rtdb, `contacts/${id}`);

  await update(contactRef, updateContact);
};
