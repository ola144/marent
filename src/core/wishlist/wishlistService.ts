/* eslint-disable @typescript-eslint/no-unused-vars */
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
} from "firebase/database";
import { rtdb } from "../firebase/firebase.config";

export const toggleWishlist = async (carId: string) => {
  if (!navigator.onLine) {
    throw new Error("No Internet Conntection");
  }

  let userData;

  const localData = localStorage.getItem("marentUser");
  if (localData !== null) {
    userData = JSON.parse(localData);
  }

  const wishlistRef = ref(rtdb, "wishlists");

  const q = query(
    wishlistRef,
    orderByChild("userId"),
    equalTo(userData.userId),
  );

  const snapshot = await get(q);

  if (snapshot.exists()) {
    const data = snapshot.val();

    const existing = Object.entries(data).find(
      ([_, value]: any) => value.carId === carId,
    );

    if (existing) {
      const [key] = existing;
      await remove(ref(rtdb, `wishlists/${key}`));

      return { type: "removed", carId };
    }
  }

  const newWishlistRef = push(wishlistRef);

  const payload = {
    id: newWishlistRef.key,
    userId: userData.userId,
    carId: carId,
  };

  await set(newWishlistRef, payload);

  return { type: "added", carId };
};

export const loadWishlist = async () => {
  if (!navigator.onLine) {
    throw new Error("No Internet Conntection");
  }

  let userData;

  const localData = localStorage.getItem("marentUser");
  if (localData !== null) {
    userData = JSON.parse(localData);
  }

  const wishlistRef = ref(rtdb, "wishlists");

  const q = query(
    wishlistRef,
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
