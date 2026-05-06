import { addToWishlist, removeFromWishlist,} from "../reducers/wishlist";

//add to wishlist
export const addToWishlistFun = (data) => async (dispatch, getState) => {
  dispatch(addToWishlist(data));
 
  localStorage.setItem("wishlistItems", JSON.stringify(getState().wishlist.wishlist));
  return data;
};



//remove from wishlist
export const removeFromWishlistFun = (data) => async (dispatch, getState) => {
  dispatch(removeFromWishlist(data._id));

  localStorage.setItem("wishlistItems", JSON.stringify(getState().wishlist.wishlist));
  return data;
};