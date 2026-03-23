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
import { toast } from "react-toastify";

export const addTask = async (taskData: any) => {
  if (!navigator.onLine) {
    toast.error("No Internet Connection ❌");
    throw new Error("No Internet Connection ❌");
  }

  let userData;

  const localData = localStorage.getItem("marentUser");
  if (localData !== null) {
    userData = JSON.parse(localData);
  }

  const taskRef = ref(rtdb, "tasks");
  const newTaskRef = push(taskRef);

  const payload = {
    id: newTaskRef.key,
    userId: userData.userId,
    ...taskData,
  };

  await set(newTaskRef, payload);
};

export const updateTaskStatus = async (status: boolean, id?: string) => {
  if (!navigator.onLine) {
    toast.error("No Internet Connection ❌");
    throw new Error("No Internet Connection ❌");
  }

  const taskRef = ref(rtdb, `tasks/${id}`);

  const payload = {
    isTaskCompleted: status,
  };

  await update(taskRef, payload);
};

export const deleteTask = async (id: string) => {
  const taskRef = ref(rtdb, `tasks/${id}`);

  await remove(taskRef);
};

export const getAllTasks = async () => {
  if (!navigator.onLine) {
    toast.error("No Internet Connection ❌");
    throw new Error("No Internet Connection ❌");
  }

  let userData;

  const localData = localStorage.getItem("marentUser");
  if (localData !== null) {
    userData = JSON.parse(localData);
  }

  const taskRef = ref(rtdb, "tasks");

  const q = query(taskRef, orderByChild("userId"), equalTo(userData.userId));

  const snapshot = await get(q);

  if (!snapshot.exists()) return [];

  const data = snapshot.val();

  return Object.keys(data).map((key) => ({
    id: key,
    ...data[key],
  }));
};
