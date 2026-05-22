import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  loading: false,
  user: null,
  error: null,
  successMessage: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loadUserRequest: (state) => {
      state.loading = true;
    },
    loadUserSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    },
    loadUserFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    updateUserInfoRequest: (state) => {
      state.loading = true;
    },
    updateUserInfoSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.successMessage = "Profile updated successfully!";
      state.error = null;
    },
    updateUserInfoFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateUserAddressRequest: (state) => {
      state.loading = true;
    },
    updateUserAddressSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.successMessage = action.payload.successMessage;
      state.error = null;
    },
    updateUserAddressFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserAddressRequest: (state) => {
      state.loading = true;
    },
    deleteUserAddressSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.successMessage = action.payload.successMessage;
      state.error = null;
    },
    deleteUserAddressFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getAllUsersRequest: (state) => {
      state.loading = true;
    },
    getAllUsersSuccess: (state, action) => {
      state.loading = false;
      state.users = action.payload;
      state.error = null;
    },
    getAllUsersFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearErrors: (state) => {
      state.error = null;
    },
    clearMessages: (state) => {
      state.successMessage = null;
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.successMessage = null;
    },
  },
});

export const {
  loadUserRequest,
  loadUserSuccess,
  loadUserFail,
  updateUserInfoRequest,
  updateUserInfoSuccess,
  updateUserInfoFailed,
  updateUserAddressRequest,
  updateUserAddressSuccess,
  updateUserAddressFailed,
  deleteUserAddressRequest,
  deleteUserAddressSuccess,
  deleteUserAddressFailed,
  getAllUsersRequest,
  getAllUsersSuccess,
  getAllUsersFailed,
  clearErrors,
  clearMessages,
  logoutUser,
} = userSlice.actions;
export const userReducer = userSlice.reducer;