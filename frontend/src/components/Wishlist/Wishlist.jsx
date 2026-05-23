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
                    return (
                      <div key={item._id || item.id || index} className="border-b px-4 py-3">
                        <div className="flex items-start gap-3">
                          {imageUrl ? (
                            <Link to={`/products/${item.name?.replace(/\s+/g, '-')}`} onClick={() => setOpenWishlist(false)}>
                              <img
                                src={imageUrl}
                                alt={item.name || ""}
                                className="w-[60px] h-[60px] rounded-md object-cover flex-shrink-0"
                                onError={(e) => { e.target.style.display = "none"; }}
                              />
                            </Link>
                          ) : (
                            <div className="w-[60px] h-[60px] rounded-md bg-gray-100 flex items-center justify-center text-gray-400 text-[10px] flex-shrink-0">
                              No Image
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/products/${item.name?.replace(/\s+/g, '-')}`}
                              onClick={() => setOpenWishlist(false)}
                              className="text-[13px] font-medium hover:text-[#3321c8] transition block truncate leading-tight"
                            >
                              {item.name || "Product"}
                            </Link>
                            <p className="text-[#d02222] font-semibold text-sm mt-0.5">US${price}</p>
                          </div>
                          <RxCross1
                            size={16}
                            className="cursor-pointer text-gray-300 hover:text-red-500 flex-shrink-0 mt-0.5"
                            onClick={() => removeHandler(item)}
                          />
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
