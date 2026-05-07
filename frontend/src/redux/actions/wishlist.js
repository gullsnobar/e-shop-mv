import { addToWishlist, removeFromWishlist } from "../reducers/wishlist";

//add to wishlist
export const addToWishlistFun = (data) => (dispatch) => {
  dispatch(addToWishlist(data));
  return data;
};

//remove from wishlist
export const removeFromWishlistFun = (data) => (dispatch) => {
  dispatch(removeFromWishlist(data._id));
  return data;
};