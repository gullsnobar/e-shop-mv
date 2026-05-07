import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allProducts: [],
  isLoading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    productsLoading: (state) => {
      state.isLoading = true;
    },
    productsSuccess: (state, action) => {
      state.isLoading = false;
      state.allProducts = action.payload;
      state.error = null;
    },
    productsError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { productsLoading, productsSuccess, productsError } =
  productsSlice.actions;
export const productsReducer = productsSlice.reducer;
