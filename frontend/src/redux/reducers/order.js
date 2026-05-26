import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  isLoading: false,
  error: null,
  success: false,
  order: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    getAllOrdersUserRequest: (state) => {
      state.isLoading = true;
    },
    getAllOrdersUserSuccess: (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
      state.error = null;
    },
    getAllOrdersUserFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    createOrderRequest: (state) => {
      state.isLoading = true;
      state.success = false;
    },
    createOrderSuccess: (state, action) => {
      state.isLoading = false;
      state.order = action.payload;
      state.success = true;
      state.error = null;
    },
    createOrderFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    },
    clearOrderState: (state) => {
      state.error = null;
      state.success = false;
      state.order = null;
    },
  },
});

export const {
  getAllOrdersUserRequest,
  getAllOrdersUserSuccess,
  getAllOrdersUserFailed,
  createOrderRequest,
  createOrderSuccess,
  createOrderFailed,
  clearOrderState,
} = orderSlice.actions;

export const orderReducer = orderSlice.reducer;
