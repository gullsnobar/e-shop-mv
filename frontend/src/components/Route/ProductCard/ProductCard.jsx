import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard.jsx";
import {
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { backend_url } from "../../../server.js";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlistFun,
  removeFromWishlistFun,
} from "../../../redux/actions/wishlist.js";
import { toast } from "react-toastify";
import { addToCartFun } from "../../../redux/actions/cart.js";
import Ratings from "../../products/Ratings.jsx";

const ProductCard = ({ data, isEvent }) => {
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);

  useEffect(() => {
    if (wishlist && wishlist.find((item) => item._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data?._id]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlistFun(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlistFun(data));
  };

  const addToCartHandler = (id) => {
    const isItemExist = cart && cart.find((i) => i._id == id);
    if (isItemExist) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addToCartFun(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  return (
    <>
      <div className="w-full h-[390px] bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 relative cursor-pointer overflow-hidden group">
        <Link
          to={
            isEvent
              ? `/product/${data._id}?isEvent=true`
              : `/product/${data._id}`
          }
        >
          <img
            src={`${data.images[0]?.url}`}
            className="w-full h-[180px] object-contain transform group-hover:scale-105 transition duration-300"
            alt=""
          />
        </Link>

        <div className="px-2">
          <Link to={`/shop/preview/${data?.shop._id}`}>
            <h5 className="text-[14px] font-medium text-blue-600 hover:underline">
              {data.shop.shopName}
            </h5>
          </Link>

          <Link
            to={
              isEvent
                ? `/product/${data._id}?isEvent=true`
                : `/product/${data._id}`
            }
          >
            <h4 className="font-semibold text-gray-800 mt-1 text-[15px] leading-tight line-clamp-2">
              {data.name}
            </h4>
            <div className="flex mt-1">
              <Ratings rating={data?.ratings} />
            </div>

            <div className="py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-lg font-semibold text-[14px]">
                  {data.discountPrice === 0
                    ? data.totalPrice
                    : data.discountPrice}
                  $
                </span>
                {data.originalPrice && (
                  <span className="line-through text-gray-500 text-[13px]">
                    {data.originalPrice}$
                  </span>
                )}
              </div>
              <span className="font-medium text-[14px] text-green-500">
                {data?.sold_out} sold
              </span>
            </div>
          </Link>
        </div>

        {/* side options */}
        <div className="absolute top-4 right-3 flex flex-col gap-3 bg-white/70 backdrop-blur-sm p-2 rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition">
          {click ? (
            <AiFillHeart
              size={22}
              className="cursor-pointer text-red-500"
              onClick={() => removeFromWishlistHandler(data)}
              title="Remove from wishlist"
            />
          ) : (
            <AiOutlineHeart
              size={22}
              className="cursor-pointer text-gray-600 hover:text-red-500 transition"
              onClick={() => addToWishlistHandler(data)}
              title="Add to wishlist"
            />
          )}

          <AiOutlineEye
            size={22}
            className="cursor-pointer text-gray-600 hover:text-blue-500 transition"
            onClick={() => setOpen(!open)}
            title="Quick view"
          />

          <AiOutlineShoppingCart
            size={24}
            className="cursor-pointer text-gray-700 hover:text-green-600 transition"
            onClick={() => addToCartHandler(data._id)}
            title="Add to cart"
          />
        </div>

        {open ? <ProductDetailsCard setOpen={setOpen} data={data} /> : null}
      </div>
    </>
  );
};

export default ProductCard;
