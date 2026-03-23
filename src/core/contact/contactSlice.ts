/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createContact,
  getAllContact,
  getAllContactByUserId,
  updateContact,
} from "./contactService";
import type { IContact } from "../auth/authTypes";

interface ContactState {
  allContacts: Array<IContact>;
  userContacts: Array<IContact>;
  loading: boolean;
  error: null;
}

const initialState: ContactState = {
  allContacts: [],
  userContacts: [],
  loading: false,
  error: null,
};

export const addContact = createAsyncThunk(
  "contact/create",
  async (contactData: any) => {
    return createContact(contactData);
  },
);

export const getUserContacts = createAsyncThunk("contact/get", async () => {
  return getAllContactByUserId();
});

export const fetchAllContacts = createAsyncThunk("contact/fetch", async () => {
  return getAllContact();
});

export const editContact = createAsyncThunk(
  "contact/edit",
  async ({ id, contactData }: { id?: string; contactData: any }) => {
    return updateContact(id, contactData);
  },
);

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addContact.pending, (state) => {
        state.loading = true;
      })
      .addCase(addContact.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addContact.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      })

      .addCase(getUserContacts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserContacts.fulfilled, (state, action: any) => {
        state.loading = false;
        state.userContacts = action.payload;
      })
      .addCase(getUserContacts.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      })

      .addCase(fetchAllContacts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllContacts.fulfilled, (state, action: any) => {
        state.loading = false;
        state.allContacts = action.payload;
      })
      .addCase(fetchAllContacts.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      })

      .addCase(editContact.pending, (state) => {
        state.loading = true;
      })
      .addCase(editContact.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(editContact.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      });
  },
});

export default contactSlice.reducer;
