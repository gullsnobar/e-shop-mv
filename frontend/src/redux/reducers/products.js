import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allProducts: [],
  shopProducts: [],
  isLoading: false,
  error: null,
  success: false,
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
    getAllProductsShopRequest: (state) => {
      state.isLoading = true;
    },
    getAllProductsShopSuccess: (state, action) => {
      state.isLoading = false;
      state.shopProducts = action.payload;
      state.error = null;
    },
    getAllProductsShopFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    createProductSuccess: (state) => {
      state.isLoading = false;
      state.success = true;
      state.error = null;
    },
    clearProductState: (state) => {
      state.success = false;
      state.error = null;
    },
  },
});

export const {
  productsLoading,
  productsSuccess,
  productsError,
  getAllProductsShopRequest,
  getAllProductsShopSuccess,
  getAllProductsShopFailed,
  createProductSuccess,
  clearProductState,
} = productsSlice.actions;
export const productsReducer = productsSlice.reducer;
