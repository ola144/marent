import { get, push, ref, remove, set, update } from "firebase/database";
import { rtdb } from "../firebase/firebase.config";
import type { ICar } from "./carType";
// import { apiClient } from "../../utils/apiClient";

export const createCar = async (carData: ICar) => {
  if (!navigator.onLine) {
    throw new Error("No Internet Conntection");
  }

  const carsRef = ref(rtdb, "cars");
  const newCarRef = push(carsRef);
  const payload = {
    id: newCarRef.key,
    ...carData,
  };

  await set(newCarRef, payload);
};

export const getAllCars = async () => {
  if (!navigator.onLine) {
    throw new Error("No Internet Conntection");
  }
  const snapshot = await get(ref(rtdb, "cars"));

  if (!snapshot.exists()) return [];

  const data = snapshot.val();

  return Object.keys(data).map((key) => ({
    id: key,
    ...data[key],
  }));
};

export const deleteCar = async (id?: string) => {
  if (!navigator.onLine) {
    throw new Error("No Internet Conntection");
  }

  const carRef = ref(rtdb, `cars/${id}`);

  await remove(carRef);
};

export const updateCar = async (id: string | undefined, updateCar: ICar) => {
  const carRef = ref(rtdb, `cars/${id}`);

  await update(carRef, updateCar);
};
