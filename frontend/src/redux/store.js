import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/user";
import wishlistReducer from "./reducers/wishlist";
import { cartReducer } from "./reducers/cart";
import { sellerReducer } from "./reducers/seller";
import { productsReducer } from "./reducers/products";

const Store = configureStore({
  reducer: {
    user: userReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
    seller: sellerReducer,
    products: productsReducer,
  },
});

export default Store;