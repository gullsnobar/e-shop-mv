import { addToCart, removeFromCart } from "../reducers/cart";

export const addToCartFun = (item) => (dispatch) => {
  dispatch(addToCart(item));
  return item;
};

export const removeFromCartFun = (id) => (dispatch) => {
  dispatch(removeFromCart(id));
  return id;
};