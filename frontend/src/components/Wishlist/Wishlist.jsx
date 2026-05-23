import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import { IoHeartOutline } from "react-icons/io5";
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
    <div
      className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-[60]"
      onClick={() => setOpenWishlist(false)}
    >
      <div
        className="fixed top-0 right-0 h-full w-[85%] max-w-[380px] bg-white flex flex-col overflow-y-scroll justify-between shadow-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {wishlist && wishlist.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center px-4">
            <div className="flex w-full justify-end pt-5 pr-5 absolute top-0 right-0">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenWishlist(false)}
              />
            </div>
            <IoHeartOutline size={40} className="text-gray-300 mb-3" />
            <h5 className="text-lg font-medium text-gray-500">Your wishlist is empty</h5>
            <button
              onClick={() => setOpenWishlist(false)}
              className="mt-4 px-5 py-2 bg-[#3321c8] text-white rounded-md text-sm hover:bg-[#261a9e] transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end pt-5 pr-5">
                <RxCross1
                  size={25}
                  className="cursor-pointer"
                  onClick={() => setOpenWishlist(false)}
                />
              </div>
              <div className="flex items-center p-4">
                <IoHeartOutline size={25} />
                <h5 className="pl-2 text-[20px] font-[500]">
                  {wishlist && wishlist.length} items
                </h5>
              </div>
              <div className="w-full border-t">
                {wishlist &&
                  wishlist.map((item, index) => {
                    const imageUrl = item?.images?.[0]?.url ?? "";
                    const price = item.discountPrice ?? item.discount_price ?? item.price ?? 0;
                    const originalPrice = item.originalPrice ?? item.original_price ?? 0;
                    return (
                      <div key={item._id || item.id || index} className="border-b px-4 py-4">
                        <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-3">
                          {/* Image */}
                          {imageUrl ? (
                            <Link to={`/products/${item.name?.replace(/\s+/g, '-')}`} onClick={() => setOpenWishlist(false)} className="flex-shrink-0">
                              <img
                                src={imageUrl}
                                alt={item.name || ""}
                                className="w-[80px] h-[80px] rounded-lg object-cover bg-white shadow-sm"
                                onError={(e) => { e.target.style.display = "none"; }}
                              />
                            </Link>
                          ) : (
                            <div className="w-[80px] h-[80px] rounded-lg bg-white flex items-center justify-center text-gray-400 text-[10px] flex-shrink-0 shadow-sm">
                              No Image
                            </div>
                          )}

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/products/${item.name?.replace(/\s+/g, '-')}`}
                              onClick={() => setOpenWishlist(false)}
                              className="text-[14px] font-semibold text-gray-800 hover:text-[#3321c8] transition block leading-snug line-clamp-2"
                            >
                              {item.name || "Product"}
                            </Link>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-[#3321c8] font-bold text-[15px]">${price}</p>
                              {originalPrice > 0 && (
                                <p className="text-gray-400 text-[13px] line-through">${originalPrice}</p>
                              )}
                            </div>
                          </div>

                          {/* Remove */}
                          <button
                            className="w-[32px] h-[32px] rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition flex-shrink-0"
                            onClick={() => removeHandler(item)}
                            title="Remove from wishlist"
                          >
                            <RxCross1 size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="px-5 mb-3">
              <button
                onClick={() => setOpenWishlist(false)}
                className="h-[45px] flex items-center justify-center w-full bg-[#3321c8] rounded-[5px] text-white text-[16px] font-[600] hover:bg-[#261a9e] transition"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
