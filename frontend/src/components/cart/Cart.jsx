import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart, removeFromCart } from "../../redux/actions/cart";
import { toast } from "react-toastify";

const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data));
    toast.success("Item removed from cart");
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + (item.qty || 1) * (item.discountPrice || item.discount_price || 0),
    0
  );

  const quantityChangeHandler = (data) => {
    dispatch(addTocart(data));
  };

  return (
    <div
      className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10"
      onClick={() => setOpenCart(false)}
    >
      <div
        className="fixed top-0 right-0 h-full w-[85%] max-w-[380px] bg-white flex flex-col overflow-y-scroll justify-between shadow-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {cart && cart.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center px-4 relative">
            <div className="flex w-full justify-end pt-5 pr-5 absolute top-0 right-0">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenCart(false)}
              />
            </div>
            <IoBagHandleOutline size={40} className="text-gray-300 mb-3" />
            <h5 className="text-lg font-medium text-gray-500">Your cart is empty</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end pt-5 pr-5">
                <RxCross1
                  size={25}
                  className="cursor-pointer"
                  onClick={() => setOpenCart(false)}
                />
              </div>
              <div className="flex items-center p-4">
                <IoBagHandleOutline size={25} />
                <h5 className="pl-2 text-[20px] font-[500]">
                  {cart && cart.length} items
                </h5>
              </div>
              <div className="w-full border-t">
                {cart &&
                  cart.map((i, index) => (
                    <CartSingle
                      key={i._id || i.id || index}
                      data={i}
                      quantityChangeHandler={quantityChangeHandler}
                      removeFromCartHandler={removeFromCartHandler}
                    />
                  ))}
              </div>
            </div>

            <div className="px-5 mb-3">
              {/* checkout buttons */}
              <Link to="/checkout">
                <div
                  className={`h-[45px] flex items-center justify-center w-[100%] bg-[#e44343] rounded-[5px]`}
                >
                  <h1 className="text-[#fff] text-[18px] font-[600]">
                    Checkout Now (USD${totalPrice.toFixed(2)})
                  </h1>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
  const [value, setValue] = useState(data.qty || 1);
  const discountPrice = data.discountPrice ?? data.discount_price ?? 0;
  const totalPrice = discountPrice * value;
  const stock = data.stock ?? 99;
  const imageUrl = data?.images?.[0]?.url ?? "";

  const increment = (data) => {
    if (stock < value + 1) {
      toast.error("Product stock limited!");
      return;
    }
    const newValue = value + 1;
    setValue(newValue);
    const updateCartData = { ...data, qty: newValue };
    quantityChangeHandler(updateCartData);
  };

  const decrement = (data) => {
    if (value <= 1) return;
    const newValue = value - 1;
    setValue(newValue);
    const updateCartData = { ...data, qty: newValue };
    quantityChangeHandler(updateCartData);
  };

  return (
    <div className="border-b px-4 py-3">
      <div className="flex items-start gap-3">
        {/* Image */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={data.name || ""}
            className="w-[60px] h-[60px] rounded-md object-cover flex-shrink-0"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div className="w-[60px] h-[60px] rounded-md bg-gray-100 flex items-center justify-center text-gray-400 text-[10px] flex-shrink-0">
            No Image
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h1 className="text-[13px] font-medium truncate leading-tight">{data.name || "Product"}</h1>
          <p className="text-[#d02222] font-semibold text-sm mt-0.5">US${totalPrice.toFixed(2)}</p>

          {/* Horizontal qty controls */}
          <div className="flex items-center gap-2 mt-1.5">
            <button
              className="w-[22px] h-[22px] flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 transition text-gray-600"
              onClick={() => decrement(data)}
            >
              <HiOutlineMinus size={14} />
            </button>
            <span className="text-[13px] font-medium w-4 text-center">{value}</span>
            <button
              className="w-[22px] h-[22px] flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 transition text-gray-600"
              onClick={() => increment(data)}
            >
              <HiPlus size={14} />
            </button>
          </div>
        </div>

        {/* Remove */}
        <RxCross1
          size={16}
          className="cursor-pointer text-gray-300 hover:text-red-500 flex-shrink-0 mt-0.5"
          onClick={() => removeFromCartHandler(data)}
        />
      </div>
    </div>
  );
};

export default Cart;