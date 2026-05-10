import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSeller: false,
  seller: null,
  loading: false,
  error: null,
};

const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    sellerSetUser: (state, action) => {
      state.seller = action.payload;
      state.isSeller = !!action.payload;
      state.error = null;
    },
    sellerLogout: (state) => {
      state.seller = null;
      state.isSeller = false;
    },
    loadSellerRequest: (state) => {
      state.loading = true;
    },
    loadSellerSuccess: (state, action) => {
      state.loading = false;
      state.seller = action.payload;
      state.isSeller = !!action.payload;
      state.error = null;
    },
    loadSellerFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isSeller = false;
    },
  },
});

export const { sellerSetUser, sellerLogout, loadSellerRequest, loadSellerSuccess, loadSellerFail } = sellerSlice.actions;
export const sellerReducer = sellerSlice.reducer;
