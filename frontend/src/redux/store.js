import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/user";
import wishlistReducer from "./reducers/wishlist";
import { cartReducer } from "./reducers/cart";
import { sellerReducer } from "./reducers/seller";
import { productsReducer } from "./reducers/products";
import { eventsReducer } from "./reducers/event";

const Store = configureStore({
  reducer: {
    user: userReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
    seller: sellerReducer,
    products: productsReducer,
    events: eventsReducer,
  },
});

export default Store;