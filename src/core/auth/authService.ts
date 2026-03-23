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
import { auth, rtdb } from "../firebase/firebase.config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import type { LoginUserData } from "./authTypes";
import { createNotification } from "../notification/notificationService";
import { toast } from "react-toastify";

export const registerUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
  role: string,
  address: string,
  city: string,
  state: string,
  zipCode: string,
  avatar: string,
) => {
  if (!navigator.onLine) {
    toast.error("No Internet Connection ❌");
    throw new Error("No Internet Connection ❌");
  }

  await createUserWithEmailAndPassword(auth, email, password);

  const payload = {
    firstName: firstName,
    lastName: lastName,
    phoneNumber: phoneNumber,
    email: email,
    password: password,
    role: role,
    address: address,
    city: city,
    state: state,
    zipCode: zipCode,
    avatar: avatar,
  };

  const userRef = ref(rtdb, "users");
  const newUserRef = push(userRef);

  await set(newUserRef, {
    ...payload,
    userId: newUserRef.key,
  }).then(() => {
    const notPayload = {
      type: "New Client",
      adminMsg: `${payload.firstName} ${payload.lastName} just create account to explore marent web application.`,
    };

    createNotification(notPayload);
  });
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<LoginUserData> => {
  if (!navigator.onLine) {
    toast.error("No Internet Connection ❌");
    throw new Error("No Internet Connection ❌");
  }

  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const user = userCredential.user;

  const userRef = ref(rtdb, "users");
  const q = query(userRef, orderByChild("email"), equalTo(email));
  const snapshot = await get(q);

  if (!snapshot.exists()) {
    alert("User data not found in database");
    // throw new Error("");
  }

  const userObject = Object.values(snapshot.val())[0] as any;

  return {
    userId: userObject.userId,
    email: user.email || "",
    firstName: userObject.firstName,
    lastName: userObject.lastName,
    phoneNumber: userObject.phoneNumber,
    role: userObject.role,
    address: userObject.address,
    city: userObject.city,
    state: userObject.state,
    zip: userObject.zip,
    avatar: userObject.avatar,
  };
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const getUser = async () => {
  if (!navigator.onLine) {
    toast.error("No Internet Connection ❌");
    throw new Error("No Internet Connection ❌");
  }

  const snapshot = await get(ref(rtdb, "users"));

  if (!snapshot.exists()) return [];

  const data = snapshot.val();

  return Object.keys(data).map((key) => ({
    id: key,
    ...data[key],
  }));
};

export const getUserByUserId = async (userId: string) => {
  if (!navigator.onLine) {
    toast.error("No Internet Connection ❌");
    throw new Error("No Internet Connection ❌");
  }

  let userData;

  const localData = localStorage.getItem("marentUser");
  if (localData !== null) {
    userData = JSON.parse(localData);
  }

  if (userData.userId) {
    const snapshot = await get(ref(rtdb, `users/${userId}`));

    if (!snapshot.exists()) return null;

    const data = snapshot.val();

    return data;
  }
};

export const updateProfile = async (
  userId: string | undefined,
  updateData: any,
) => {
  if (!navigator.onLine) {
    toast.error("No Internet Connection ❌");
    throw new Error("No Internet Connection ❌");
  }

  const userRef = ref(rtdb, `users/${userId}`);

  await update(userRef, updateData);
};
