import React, { useState, useEffect } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createOrder, createStripeOrder, createPayPalOrder } from "../redux/actions/order";
import { clearCart } from "../redux/reducers/cart";
import { toast } from "react-toastify";

const PaymentPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { isLoading } = useSelector((state) => state.order);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const shippingAddress = localStorage.getItem("shippingAddress");
    if (!shippingAddress) {
      navigate("/checkout");
      return;
    }
  }, [isAuthenticated, navigate]);

  const shippingPrice = 0;
  const itemsPrice = cart.reduce(
    (acc, item) => acc + (item.qty || 1) * (item.discountPrice || item.discount_price || 0),
    0
  );
  const totalPrice = itemsPrice + shippingPrice - discountAmount;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    if (couponCode.trim().toUpperCase() === "DISCOUNT10") {
      const discount = itemsPrice * 0.1;
      setDiscountAmount(discount);
      setCouponApplied(true);
      toast.success("Coupon applied! 10% discount");
    } else {
      toast.error("Invalid coupon code");
      setDiscountAmount(0);
      setCouponApplied(false);
    }
  };

  const handleConfirm = async () => {
    const shippingAddress = JSON.parse(localStorage.getItem("shippingAddress") || "{}");
    if (!shippingAddress.address1) {
      toast.error("Please fill shipping address first");
      navigate("/checkout");
      return;
    }

    const orderData = {
      cart: cart.map((item) => ({
        productId: item._id || item.id,
        name: item.name,
        images: item.images || [],
        qty: item.qty || 1,
        price: item.price || item.discountPrice || 0,
        discountPrice: item.discountPrice || item.discount_price || 0,
        shopId: item.shop?._id || item.shopId || null,
      })),
      shippingAddress,
      totalPrice,
      shippingPrice,
      discountPrice: discountAmount,
      paymentInfo: { type: paymentMethod },
    };

    try {
      if (paymentMethod === "COD") {
        const order = await dispatch(createOrder(orderData));
        if (order) {
          dispatch(clearCart());
          localStorage.removeItem("shippingAddress");
          navigate(`/order/success/${order._id}`);
        }
      } else if (paymentMethod === "Stripe") {
        const successUrl = `${window.location.origin}/order/success/stripe?session_id={CHECKOUT_SESSION_ID}`;
        const cancelUrl = `${window.location.origin}/payment`;
        await dispatch(createStripeOrder({ ...orderData, successUrl, cancelUrl }));
      } else if (paymentMethod === "PayPal") {
        await dispatch(createPayPalOrder(orderData));
      }
    } catch (error) {
      console.log("Payment error:", error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="max-w-[1000px] mx-auto px-4 py-8">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="flex items-center">
            <div className="bg-[#e44343] text-white px-4 py-2 rounded-full text-sm font-medium">
              1.Shipping
            </div>
            <div className="w-10 h-0.5 bg-[#e44343] mx-1"></div>
          </div>
          <div className="flex items-center">
            <div className="bg-[#e44343] text-white px-4 py-2 rounded-full text-sm font-medium">
              2.Payment
            </div>
            <div className="w-10 h-0.5 bg-[#ffcccc] mx-1"></div>
          </div>
          <div>
            <div className="bg-[#ffcccc] text-[#e44343] px-4 py-2 rounded-full text-sm font-medium">
              3.Success
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Payment Methods */}
          <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Select Payment Method</h2>

            <div className="space-y-4">
              <label
                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === "Stripe" ? "border-[#e44343] bg-red-50" : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="Stripe"
                  checked={paymentMethod === "Stripe"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 accent-[#e44343]"
                />
                <span className="text-sm font-medium text-gray-700">Pay with Debit/credit card</span>
              </label>

              <label
                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === "PayPal" ? "border-[#e44343] bg-red-50" : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="PayPal"
                  checked={paymentMethod === "PayPal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 accent-[#e44343]"
                />
                <span className="text-sm font-medium text-gray-700">Pay with Paypal</span>
              </label>

              <label
                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === "COD" ? "border-[#e44343] bg-red-50" : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 accent-[#e44343]"
                />
                <span className="text-sm font-medium text-gray-700">Cash on Delivery</span>
              </label>
            </div>

            <div className="mt-8">
              <button
                onClick={handleConfirm}
                disabled={isLoading || !cart || cart.length === 0}
                className={`w-full h-[44px] rounded-lg text-white text-[14px] font-medium transition-colors ${
                  isLoading || !cart || cart.length === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#e44343] hover:bg-[#c93333]"
                }`}
              >
                {isLoading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-[340px]">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>subtotal:</span>
                  <span className="font-medium">${itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>shipping:</span>
                  <span className="font-medium">{shippingPrice > 0 ? `$${shippingPrice.toFixed(2)}` : "-"}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span className="font-medium">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Discount:</span>
                  <span className="font-medium">{discountAmount > 0 ? `-$${discountAmount.toFixed(2)}` : "-"}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-gray-800">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Coupon */}
              <div className="mt-6">
                <input
                  type="text"
                  placeholder="Coupoun code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={couponApplied}
                  className="w-full px-3 h-[40px] border border-gray-200 rounded text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-400 mb-3"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponApplied}
                  className={`w-full h-[40px] rounded text-sm font-medium transition-colors ${
                    couponApplied
                      ? "bg-green-50 text-green-600 border border-green-200 cursor-default"
                      : "border border-[#e44343] text-[#e44343] hover:bg-red-50"
                  }`}
                >
                  {couponApplied ? "Applied" : "Apply code"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentPage;