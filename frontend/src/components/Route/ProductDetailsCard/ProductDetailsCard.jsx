import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";
import styles from "../../../styles/styles";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCartFun } from "../../../redux/actions/cart";
import {
  addToWishlistFun,
  removeFromWishlistFun,
} from "../../../redux/actions/wishlist";
import axios from "axios";
import { server } from "../../../server";

const ProductDetailsCard = ({ setOpen, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const navigate= useNavigate();

  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const dispatch = useDispatch();

  const handleMessageSubmit = async () => {
    if (isAuthenticated == false) {
      toast.error("please login to send message");
      return;
    }

    const groupTitle = data.shop._id + user._id;
    const userId = user._id;
    const sellerId = data.shop._id;

    if (isAuthenticated) {
      await axios
        .post(`${server}/conversation/create-new-conversation`, {
          groupTitle,
          userId,
          sellerId,
        })
        .then((res) => {
          navigate(`/inbox?${res.data.conversation._id}`);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else {
      toast.error("please login to continue");
    }
  };

  const decrementCount = () => {
    if (count > 1) setCount(count - 1);
  };

  const incrementCount = () => {
    setCount(count + 1);
  };

  const addToCartHandler = (id) => {
    const isItemExist = cart && cart.find((i) => i._id == id);
    if (isItemExist) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < count) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addToCartFun(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  useEffect(() => {
    if (wishlist && wishlist.find((item) => item._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data._id]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlistFun(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlistFun(data));
  };

  return (
    <div className="bg-[#fff]">
      {data ? (
        <div className="w-full fixed inset-0 bg-black/40 z-40 flex items-center justify-center">
          <div className="w-[90%] md:w-[65%] h-[90vh] md:h-[80vh] bg-white rounded-2xl shadow-xl relative p-5 overflow-y-auto transform transition-all scale-100">
            {/* Close Button */}
            <button
              className="absolute right-4 top-4 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
              onClick={() => setOpen(false)}
            >
              <RxCross1 size={20} className="text-gray-700" />
            </button>

            <div className="w-full flex flex-col md:flex-row gap-6">
              {/* Left Section */}
              <div className="w-full md:w-[50%] flex flex-col items-center">
                <div className="w-full bg-gray-50 rounded-xl flex items-center justify-center p-4">
                  <img
                    src={`${data?.images[0]?.url}`}
                    alt=""
                    className="max-h-[250px] object-contain"
                  />
                </div>

                <Link
                  to={`/shop/preview/${data.shop._id}`}
                  className="flex items-center mt-4 w-full bg-gray-50 p-3 rounded-xl hover:shadow transition"
                >
                  <img
                    src={`${data?.shop.avatar?.url}`}
                    alt=""
                    className="w-[50px] h-[50px] rounded-full mr-3"
                  />
                  <div>
                    <h3 className="text-[16px] font-semibold text-gray-800 hover:underline">
                      {data.shop.name}
                    </h3>
                    <h5 className="text-[14px] text-gray-500">
                      ({data.shop.ratings}) Ratings
                    </h5>
                  </div>
                </Link>

                <button
                  className="mt-4 w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl py-2 font-medium hover:opacity-90 transition flex items-center justify-center gap-1"
                  onClick={handleMessageSubmit}
                >
                  Send Message <AiOutlineMessage />
                </button>

                <h5 className="text-[15px] text-red-500 mt-3">
                  ({data.total_sell}) Sold out
                </h5>
              </div>

              {/* Right Section */}
              <div className="w-full md:w-[50%] pt-3">
                <h1 className="text-[22px] font-bold text-gray-800">
                  {data.name}
                </h1>
                <p className="text-gray-600 mt-2 text-[15px] leading-relaxed">
                  {data.description}
                </p>

                {/* Price */}
                <div className="pt-4 flex items-center gap-3">
                  <h4 className="text-[22px] font-bold text-indigo-600">
                    {data.discount_price}$
                  </h4>
                  {data.price && (
                    <h3 className="line-through text-gray-500 text-[16px]">
                      {data.price}$
                    </h3>
                  )}
                </div>

                {/* Quantity + Wishlist */}
                <div className="flex items-center mt-10 justify-between pr-3">
                  {/* Quantity */}
                  <div className="flex items-center">
                    <button
                      className="bg-indigo-500 text-white font-bold rounded-l px-4 py-2 hover:bg-indigo-600 transition"
                      onClick={decrementCount}
                    >
                      -
                    </button>
                    <span className="bg-gray-100 text-gray-800 font-medium px-4 py-[10px]">
                      {count}
                    </span>
                    <button
                      className="bg-indigo-500 text-white font-bold rounded-r px-4 py-2 hover:bg-indigo-600 transition"
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>

                  {/* Wishlist */}
                  <div>
                    {click ? (
                      <AiFillHeart
                        size={26}
                        className="cursor-pointer text-red-500 hover:scale-110 transition"
                        onClick={() => removeFromWishlistHandler(data)}
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={26}
                        className="cursor-pointer text-gray-600 hover:text-red-500 hover:scale-110 transition"
                        onClick={() => addToWishlistHandler(data)}
                        title="Add to wishlist"
                      />
                    )}
                  </div>
                </div>

                {/* Add to Cart */}
                <button
                  className="mt-6 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl py-3 font-medium hover:opacity-90 transition flex items-center justify-center gap-1"
                  onClick={() => addToCartHandler(data._id)}
                >
                  Add to Cart <AiOutlineShoppingCart />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetailsCard;