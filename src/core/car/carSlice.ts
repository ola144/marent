/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ICar } from "./carType";
import { createCar, deleteCar, getAllCars, updateCar } from "./carService";
import { toast } from "react-toastify";

interface intialStateType {
  cars: ICar[];
  car: null;
  loading: boolean;
  error: null;
}

const initialState: intialStateType = {
  cars: [],
  car: null,
  loading: false,
  error: null,
};

export const addCar = createAsyncThunk("car/create", async (car: ICar) => {
  return await createCar(car);
});

export const fetchCars = createAsyncThunk("car/get", async () => {
  return await getAllCars();
});

export const removeCar = createAsyncThunk("car/delete", async (id?: string) => {
  return await deleteCar(id);
});

export const editCar = createAsyncThunk(
  "car/update",
  async ({ id, carData }: { id: string | undefined; carData: any }) => {
    return await updateCar(id, carData);
  },
);

const carSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(addCar.pending, (state) => {
        state.loading = true;
      })

      .addCase(addCar.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.error.message ?? null;
        toast.error(action.error.message);
      })

      .addCase(addCar.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(fetchCars.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchCars.fulfilled, (state, action: any) => {
        state.loading = false;
        state.cars = action.payload;
      })

      .addCase(fetchCars.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.error.message ?? null;
        state.cars = [];
      })

      .addCase(removeCar.pending, (state) => {
        state.loading = true;
      })

      .addCase(removeCar.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      })

      .addCase(removeCar.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(editCar.pending, (state) => {
        state.loading = true;
      })

      .addCase(editCar.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      })

      .addCase(editCar.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export default carSlice.reducer;
