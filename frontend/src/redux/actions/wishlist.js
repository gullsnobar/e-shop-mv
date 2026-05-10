import {
  addToWishlist as addToWishlistSlice,
  removeFromWishlist as removeFromWishlistSlice,
} from "../reducers/wishlist";

// add to wishlist
export const addToWishlist = (data) => async (dispatch, getState) => {
  dispatch(addToWishlistSlice(data));
  localStorage.setItem("wishlistItems", JSON.stringify(getState().wishlist.wishlist));
  return data;
};

// remove from wishlist
export const removeFromWishlist = (data) => async (dispatch, getState) => {
  dispatch(removeFromWishlistSlice(data._id || data.id));
  localStorage.setItem("wishlistItems", JSON.stringify(getState().wishlist.wishlist));
  return data;
};
