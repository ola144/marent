/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser, logoutUser } from "./authService";
import type { AuthState } from "./authTypes";
// import { toast } from "react-toastify";

const localUser = localStorage.getItem("marentUser");

const initialState: AuthState = {
  user: localUser ? JSON.parse(localUser) : null,
  loading: false,
  error: null,
};

export const register = createAsyncThunk(
  "auth/register",
  async ({
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    role,
    address,
    city,
    state,
    zipCode,
    avatar,
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    avatar: string;
  }) => {
    return await registerUser(
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      role,
      address,
      city,
      state,
      zipCode,
      avatar,
    );
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }) => {
    return await loginUser(email, password);
  },
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await logoutUser();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
      })

      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
        // toast.error(action.error.message);
      })

      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(login.pending, (state) => {
        state.loading = true;
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      })

      .addCase(login.fulfilled, (state, action: any) => {
        state.user = action.payload;
        localStorage.setItem("marentUser", JSON.stringify(action.payload));
        state.loading = false;
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = {
          userId: "",
          email: "",
          firstName: "",
          lastName: "",
          phoneNumber: "",
          role: "",
          address: "",
          city: "",
          state: "",
          zip: "",
          avatar: "",
        };
        localStorage.removeItem("marentUser");
      });
  },
});

export default authSlice.reducer;
