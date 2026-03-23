/* eslint-disable @typescript-eslint/no-explicit-any */
// import { toast } from "react-toastify";
import { setOffline } from "../core/appSlice/appSlice";
import { store } from "../store";

export const apiClient = async <T>(callback: () => Promise<T>): Promise<T> => {
  // check internet connection
  if (navigator.onLine) {
    store.dispatch(setOffline());
    // throw new Error("Offline");
  }

  try {
    // execute API call
    const response = await callback();
    return response;
  } catch (error: any) {
    if (!navigator.onLine) {
      store.dispatch(setOffline());
    } else {
      // toast.error(error?.message || "Somenting went wrong!");
    }
    throw error;
  }
};
