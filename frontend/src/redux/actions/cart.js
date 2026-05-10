import {
  addToCart as addToCartSlice,
  removeFromCart as removeFromCartSlice,
} from "../reducers/cart";

// add to cart
export const addTocart = (data) => async (dispatch, getState) => {
  dispatch(addToCartSlice(data));
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
  return data;
};

// remove from cart
export const removeFromCart = (data) => async (dispatch, getState) => {
  dispatch(removeFromCartSlice(data._id || data.id));
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
  return data;
};