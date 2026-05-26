import React, { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyStripePayment, capturePayPalOrder } from "../redux/actions/order";
import { clearCart } from "../redux/reducers/cart";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../server";

const OrderPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Stripe redirect: /order/success/stripe?session_id=xxx
        const sessionId = searchParams.get("session_id");
        if (sessionId) {
          const result = await dispatch(verifyStripePayment(sessionId));
          if (result) {
            dispatch(clearCart());
            localStorage.removeItem("shippingAddress");
            setOrder(result);
          }
          setLoading(false);
          return;
        }

        // PayPal redirect: /order/success/paypal?token=xxx&PayerID=yyy
        const payPalToken = searchParams.get("token");
        if (payPalToken && id === "paypal") {
          const result = await dispatch(capturePayPalOrder(payPalToken));
          if (result) {
            dispatch(clearCart());
            localStorage.removeItem("shippingAddress");
            setOrder(result);
          }
          setLoading(false);
          return;
        }

        // COD or already verified order: /order/success/:orderId
        if (id && id !== "stripe" && id !== "paypal") {
          const { data } = await axios.get(`${server}/order/get-order/${id}`, {
            withCredentials: true,
          });
          setOrder(data.order);
          dispatch(clearCart());
          localStorage.removeItem("shippingAddress");
          setLoading(false);
          return;
        }

        setLoading(false);
      } catch (err) {
        console.log("Order success page error:", err);
        toast.error("Failed to load order details");
        setLoading(false);
      }
    };

    processPayment();
  }, [id, searchParams, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-gray-600">Processing your order...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-[600px] mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Thank you for your purchase. Your order is being processed.
          </p>

          {order && (
            <div className="bg-gray-50 rounded-lg p-4 text-left mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Order ID:</span>
                <span className="font-medium text-gray-800">{order._id}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Payment Method:</span>
                <span className="font-medium text-gray-800">{order.paymentInfo?.type || "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Status:</span>
                <span className="font-medium text-gray-800">{order.status}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total:</span>
                <span className="font-bold text-gray-800">${order.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
          )}

          <button
            onClick={() => navigate("/")}
            className="px-8 py-2.5 bg-[#e44343] text-white rounded-lg text-sm font-medium hover:bg-[#c93333] transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderPage;
