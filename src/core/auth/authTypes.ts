/* eslint-disable @typescript-eslint/no-explicit-any */
// import type { User } from "firebase/auth";

export interface AuthState {
  user: {
    userId: string | undefined | any;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    avatar: string;
  };
  loading: boolean;
  error: string | null;
}

export interface LoginUserData {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  avatar: string;
}

export interface IUser {
  users: Array<user>;
  user: user | null;
  loading: boolean;
  error: string | null;
}

interface user {
  userId?: string;
  email?: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  avatar?: string;
}

export interface IContact {
  adminReply: string;
  email: string;
  id?: string;
  message: string;
  name: string;
  subject: string;
  userId: string;
  createdDate?: string;
  status: string;
}

export interface INotification {
  id?: string;
  userId: string;
  createdAt?: string;
  isAdminRead: boolean;
  isClientRead: boolean;
  type?: string;
  clientMsg: string;
  adminMsg: string;
}
