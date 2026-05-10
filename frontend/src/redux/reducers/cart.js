import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: typeof window !== "undefined" && localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const itemId = item._id || item.id;
      const isItemExist = state.cart.find((i) => (i._id || i.id) === itemId);
      if (isItemExist) {
        state.cart = state.cart.map((i) =>
          (i._id || i.id) === itemId ? item : i
        );
      } else {
        state.cart.push(item);
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("cartItems", JSON.stringify(state.cart));
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((i) => (i._id || i.id) !== action.payload);
      if (typeof window !== "undefined") {
        localStorage.setItem("cartItems", JSON.stringify(state.cart));
      }
    },
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
