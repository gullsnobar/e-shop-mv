import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/user";
import wishlistReducer from "./reducers/wishlist";
import { cartReducer } from "./reducers/cart";

const Store = configureStore({
  reducer: {
    user: userReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
  },
});

export default Store;