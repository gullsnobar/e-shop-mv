import React from "react";
import { useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";

const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart);

  return (
    <div className={`${styles.cart}`}>
      <div className="fixed top-0 left-0 w-full bg-black h-screen z-10 opacity-50"></div>
      <div className="fixed top-0 right-0 h-screen w-[80%] 800px:w-[25%] bg-white z-10 overflow-y-scroll">
        <div className="flex w-full justify-end pt-5 pr-5">
          <RxCross1
            size={25}
            className="cursor-pointer"
            onClick={() => setOpenCart(false)}
          />
        </div>
        <div className={`${styles.noramlFlex} flex-col p-8`}>
          <h1 className="text-2xl font-bold">Cart Items</h1>
          {cart && cart.length === 0 ? (
            <p className="mt-4">Your cart is empty</p>
          ) : (
            <div className="mt-4">
              {cart &&
                cart.map((item, index) => (
                  <div key={index} className="border-b py-4">
                    <p>{item.name}</p>
                    <p>Price: ${item.price}</p>
                    <p>Qty: {item.qty}</p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
