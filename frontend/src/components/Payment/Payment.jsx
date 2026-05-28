import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { RxCross1 } from "react-icons/rx";

const Payment = () => {
  const [orderData, setOrderData] = useState([]);
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem("latestOrder"));
    setOrderData(orderData);
  }, []);

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            description: "Sunflower",
            amount: {
              currency_code: "USD",
              value: orderData?.totalPrice,
            },
          },
        ],
        // not needed if a shipping address is actually needed
        application_context: {
          shipping_preference: "NO_SHIPPING",
        },
      })
      .then((orderID) => {
        return orderID;
      });
  };

  const order = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user: user && user,
    totalPrice: orderData?.totalPrice,
  };

  const onApprove = async (data, actions) => {
    return actions.order.capture().then(function (details) {
      const { payer } = details;

      let paymentInfo = payer;

      if (paymentInfo !== undefined) {
        paypalPaymentHandler(paymentInfo);
      }
    });
  };

  const paypalPaymentHandler = async (paymentInfo) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    order.paymentInfo = {
      id: paymentInfo.payer_id,
      status: "succeeded",
      type: "Paypal",
    };

    await axios
      .post(`${server}/order/create-order`, order, config)
      .then((res) => {
        setOpen(false);
        navigate("/order/success");
        toast.success("Order successful!");
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));
        window.location.reload();
      });
  };

  const paymentData = {
    amount: Math.round(orderData?.totalPrice * 100),
  };

  const paymentHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${server}/payment/process`,
        paymentData,
        config
      );

      const client_secret = data.client_secret;

      if (!stripe || !elements) return;
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
            type: "Credit Card",
          };

          await axios
            .post(`${server}/order/create-order`, order, config)
            .then((res) => {
              setOpen(false);
              navigate("/order/success");
              toast.success("Order successful!");
              localStorage.setItem("cartItems", JSON.stringify([]));
              localStorage.setItem("latestOrder", JSON.stringify([]));
              window.location.reload();
            });
        }
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    order.paymentInfo = {
      type: "Cash On Delivery",
    };

    await axios
    .post(`${server}/order/create-order`, order, config)
    .then((res) => {
      setOpen(false);
      navigate("/order/success");
      toast.success("Order successful!");
      localStorage.setItem("cartItems", JSON.stringify([]));
      localStorage.setItem("latestOrder", JSON.stringify([]));
      window.location.reload();
    });
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 min-w-0">
          <PaymentInfo
            user={user}
            open={open}
            setOpen={setOpen}
            onApprove={onApprove}
            createOrder={createOrder}
            paymentHandler={paymentHandler}
            cashOnDeliveryHandler={cashOnDeliveryHandler}
          />
        </div>
        <div className="w-full lg:w-[340px] flex-shrink-0">
          <CartData orderData={orderData} />
        </div>
      </div>
    </div>
  );
};

const PaymentInfo = ({
  user,
  open,
  setOpen,
  onApprove,
  createOrder,
  paymentHandler,
  cashOnDeliveryHandler,
}) => {
  const [select, setSelect] = useState(1);

  return (
    <div className="bg-white rounded-[16px] shadow-sm p-6 md:p-8">
      <div className="space-y-0">
        {/* Stripe */}
        <div className="border-b border-[#e5e7eb]">
          <label className="flex items-center gap-4 py-5 cursor-pointer">
            <div
              onClick={() => setSelect(1)}
              className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${select === 1 ? "border-[#ff3654] bg-[#ff3654]" : "border-[#bbb] bg-white"}`}
            >
              {select === 1 && <div className="w-[8px] h-[8px] rounded-full bg-white" />}
            </div>
            <span className="text-[15px] font-medium text-[#222]">Pay with Debit/credit card</span>
          </label>
          {select === 1 && (
            <div className="pb-6 pl-[38px]">
              <form className="w-full space-y-4" onSubmit={paymentHandler}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-medium text-gray-500 mb-1.5">Name On Card</label>
                    <input
                      required
                      placeholder={user?.name || "Name on card"}
                      className="w-full h-[44px] px-4 rounded-lg border border-gray-200 text-gray-800 text-[14px] focus:outline-none focus:border-[#ff3654] focus:ring-[3px] focus:ring-[#ff3654]/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-500 mb-1.5">Exp Date</label>
                    <div className="w-full h-[44px] px-4 rounded-lg border border-gray-200 flex items-center focus-within:border-[#ff3654] focus-within:ring-[3px] focus-within:ring-[#ff3654]/10 transition-all">
                      <CardExpiryElement
                        className="w-full"
                        options={{ style: { base: { fontSize: "14px", lineHeight: 1.5, color: "#444", "::placeholder": { color: "#999" } } } }}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-medium text-gray-500 mb-1.5">Card Number</label>
                    <div className="w-full h-[44px] px-4 rounded-lg border border-gray-200 flex items-center focus-within:border-[#ff3654] focus-within:ring-[3px] focus-within:ring-[#ff3654]/10 transition-all">
                      <CardNumberElement
                        className="w-full"
                        options={{ style: { base: { fontSize: "14px", lineHeight: 1.5, color: "#444", "::placeholder": { color: "#999" } } } }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-500 mb-1.5">CVV</label>
                    <div className="w-full h-[44px] px-4 rounded-lg border border-gray-200 flex items-center focus-within:border-[#ff3654] focus-within:ring-[3px] focus-within:ring-[#ff3654]/10 transition-all">
                      <CardCvcElement
                        className="w-full"
                        options={{ style: { base: { fontSize: "14px", lineHeight: 1.5, color: "#444", "::placeholder": { color: "#999" } } } }}
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="h-[48px] px-10 bg-gradient-to-r from-[#ff3654] to-[#f63b60] text-white font-semibold text-[14px] rounded-lg hover:from-[#e62e4d] hover:to-[#e02b5a] hover:shadow-lg transition-all duration-300"
                >
                  Submit
                </button>
              </form>
            </div>
          )}
        </div>

        {/* PayPal */}
        <div className="border-b border-[#e5e7eb]">
          <label className="flex items-center gap-4 py-5 cursor-pointer">
            <div
              onClick={() => setSelect(2)}
              className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${select === 2 ? "border-[#ff3654] bg-[#ff3654]" : "border-[#bbb] bg-white"}`}
            >
              {select === 2 && <div className="w-[8px] h-[8px] rounded-full bg-white" />}
            </div>
            <span className="text-[15px] font-medium text-[#222]">Pay with Paypal</span>
          </label>
          {select === 2 && (
            <div className="pb-6 pl-[38px]">
              <button
                onClick={() => setOpen(true)}
                className="h-[48px] px-10 bg-gradient-to-r from-[#ff3654] to-[#f63b60] text-white font-semibold text-[14px] rounded-lg hover:from-[#e62e4d] hover:to-[#e02b5a] hover:shadow-lg transition-all duration-300"
              >
                Pay Now
              </button>
              {open && (
                <div className="fixed inset-0 bg-black/50 z-[99999] flex items-center justify-center p-4">
                  <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-xl p-6 relative">
                    <button
                      onClick={() => setOpen(false)}
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <RxCross1 size={18} className="text-gray-600" />
                    </button>
                    <h3 className="text-[18px] font-bold text-gray-800 mb-6 text-center">Pay with PayPal</h3>
                    <PayPalScriptProvider
                      options={{ "client-id": "Aczac4Ry9_QA1t4c7TKH9UusH3RTe6onyICPoCToHG10kjlNdI-qwobbW9JAHzaRQwFMn2-k660853jn" }}
                    >
                      <PayPalButtons style={{ layout: "vertical" }} onApprove={onApprove} createOrder={createOrder} />
                    </PayPalScriptProvider>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* COD */}
        <div>
          <label className="flex items-center gap-4 py-5 cursor-pointer">
            <div
              onClick={() => setSelect(3)}
              className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${select === 3 ? "border-[#ff3654] bg-[#ff3654]" : "border-[#bbb] bg-white"}`}
            >
              {select === 3 && <div className="w-[8px] h-[8px] rounded-full bg-white" />}
            </div>
            <span className="text-[15px] font-medium text-[#222]">Cash on Delivery</span>
          </label>
          {select === 3 && (
            <div className="pb-6 pl-[38px]">
              <form onSubmit={cashOnDeliveryHandler}>
                <button
                  type="submit"
                  className="h-[48px] px-10 bg-gradient-to-r from-[#ff3654] to-[#f63b60] text-white font-semibold text-[14px] rounded-lg hover:from-[#e62e4d] hover:to-[#e02b5a] hover:shadow-lg transition-all duration-300"
                >
                  Confirm
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CartData = ({ orderData }) => {
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const shipping = (orderData?.shipping ?? 0).toFixed(2);
  const subTotal = orderData?.subTotalPrice ?? "0.00";
  const discount = orderData?.discountPrice ?? "0.00";
  const total = orderData?.totalPrice ?? "0.00";

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) { toast.error("Please enter a coupon code"); return; }
    if (couponCode.trim().toUpperCase() === "DISCOUNT10") { setCouponApplied(true); toast.success("Coupon applied! 10% discount"); }
    else { toast.error("Invalid coupon code"); setCouponApplied(false); }
  };

  return (
    <div className="bg-white rounded-[16px] shadow-sm p-6">
      <div className="space-y-4 text-[14px]">
        <div className="flex justify-between text-[#666]"><span>subtotal:</span><span className="font-semibold text-[#222]">${subTotal}</span></div>
        <div className="flex justify-between text-[#666]"><span>shipping:</span><span className="font-semibold text-[#222]">{parseFloat(shipping) > 0 ? `$${shipping}` : "-"}</span></div>
        <div className="flex justify-between text-[#666]"><span>Discount:</span><span className="font-semibold text-[#222]">{parseFloat(discount) > 0 ? `-$${discount}` : "-"}</span></div>
        <div className="border-t border-[#e5e7eb] pt-4 flex justify-between items-center"><span className="text-[15px] font-bold text-[#222]">${total}</span></div>
      </div>
      <div className="mt-6 space-y-3">
        <input type="text" placeholder="Coupoun code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} disabled={couponApplied}
          className="w-full px-4 h-[44px] border border-[#e5e7eb] rounded-[10px] text-[14px] text-[#222] placeholder-[#999] focus:outline-none focus:border-[#ff3654] transition-all" />
        <button onClick={handleApplyCoupon} disabled={couponApplied}
          className={`w-full h-[44px] rounded-[10px] text-[14px] font-semibold transition-all duration-200 ${couponApplied ? "bg-green-50 text-green-600 border border-green-200 cursor-default" : "border border-[#ff3654] text-[#ff3654] hover:bg-[#fff5f7] active:scale-[0.98]"}`}>
          {couponApplied ? "Applied" : "Apply code"}
        </button>
      </div>
    </div>
  );
};
export default Payment;