import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSeller: false,
  seller: null,
};

const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    sellerSetUser: (state, action) => {
      state.seller = action.payload;
      state.isSeller = !!action.payload;
    },
    sellerLogout: (state) => {
      state.seller = null;
      state.isSeller = false;
    },
  },
});

export const { sellerSetUser, sellerLogout } = sellerSlice.actions;
export const sellerReducer = sellerSlice.reducer;
