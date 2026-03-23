/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loadWishlist, toggleWishlist } from "./wishlistService";
import type { IWishlist } from "../car/carType";

type WishlistState = {
  wishlist: IWishlist[];
  loading: boolean;
  error: null;
};

const initialState: WishlistState = {
  wishlist: [],
  loading: false,
  error: null,
};

export const toggleWishlistItem = createAsyncThunk(
  "wishlist/toggle",
  async (carId: string) => {
    return await toggleWishlist(carId);
  },
);

export const getWishlist = createAsyncThunk("wishlist/fetch", async () => {
  return await loadWishlist();
});

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(toggleWishlistItem.pending, (state) => {
        state.loading = true;
      })

      .addCase(toggleWishlistItem.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      })

      .addCase(toggleWishlistItem.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(getWishlist.pending, (state) => {
        state.loading = true;
      })

      .addCase(getWishlist.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      })

      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      });
  },
});

export default wishlistSlice.reducer;
