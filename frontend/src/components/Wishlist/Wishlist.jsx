import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";
import { removeFromWishlist } from "../../redux/actions/wishlist";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Wishlist = ({ setOpenWishlist }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const removeHandler = (item) => {
    dispatch(removeFromWishlist(item));
    toast.success("Removed from wishlist");
  };

  return (
    <div className={`${styles.wishlist}`}>
      <div className="fixed top-0 left-0 w-full bg-black h-screen z-10 opacity-50"></div>
      <div className="fixed top-0 right-0 h-screen w-[80%] 800px:w-[25%] bg-white z-10 overflow-y-scroll">
        <div className="flex w-full justify-end pt-5 pr-5">
          <RxCross1
            size={25}
            className="cursor-pointer"
            onClick={() => setOpenWishlist(false)}
          />
        </div>
        <div className={`${styles.noramlFlex} flex-col p-8`}>
          <h1 className="text-2xl font-bold">Wishlist</h1>
          {wishlist && wishlist.length === 0 ? (
            <div className="mt-8 text-center">
              <p className="text-gray-500">Your wishlist is empty</p>
              <button
                onClick={() => setOpenWishlist(false)}
                className="mt-4 px-5 py-2 bg-[#3321c8] text-white rounded-md text-sm hover:bg-[#261a9e] transition"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="mt-4 w-full">
              {wishlist &&
                wishlist.map((item, index) => {
                  const imageUrl = item?.images?.[0]?.url ?? "";
                  const price = item.discountPrice ?? item.discount_price ?? item.price ?? 0;
                  return (
                    <div key={item._id || item.id || index} className="border-b py-4 flex items-center gap-3">
                      {imageUrl ? (
                        <Link to={`/product/${item._id || item.id}`} onClick={() => setOpenWishlist(false)}>
                          <img
                            src={imageUrl}
                            alt={item.name || ""}
                            className="w-[60px] h-[60px] object-cover rounded"
                            onError={(e) => { e.target.style.display = "none"; }}
                          />
                        </Link>
                      ) : (
                        <div className="w-[60px] h-[60px] bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item._id || item.id}`}
                          onClick={() => setOpenWishlist(false)}
                          className="text-sm font-medium hover:text-[#3321c8] transition block truncate"
                        >
                          {item.name || "Product"}
                        </Link>
                        <p className="text-[#d02222] font-semibold text-sm mt-0.5">${price}</p>
                      </div>
                      <RxCross1
                        size={18}
                        className="cursor-pointer text-gray-400 hover:text-red-500 flex-shrink-0"
                        onClick={() => removeHandler(item)}
                      />
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
