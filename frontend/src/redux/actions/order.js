import axios from "axios";
import { server } from "../../server";
import {
  getAllOrdersUserRequest,
  getAllOrdersUserSuccess,
  getAllOrdersUserFailed,
  createOrderRequest,
  createOrderSuccess,
  createOrderFailed,
} from "../reducers/order";
import { toast } from "react-toastify";

// get all orders of user
export const getAllOrdersOfUser = (userId) => async (dispatch) => {
  try {
    dispatch(getAllOrdersUserRequest());

    const { data } = await axios.get(`${server}/order/get-all-orders/${userId}`);

    dispatch(getAllOrdersUserSuccess(data.orders));
  } catch (error) {
    dispatch(getAllOrdersUserFailed(error.response?.data?.message || "Something went wrong"));
  }
};

// get all orders of shop
export const getAllOrdersOfShop = (shopId) => async (dispatch) => {
  try {
    dispatch(getAllOrdersUserRequest());

    const { data } = await axios.get(`${server}/order/get-all-orders-shop/${shopId}`);

    dispatch(getAllOrdersUserSuccess(data.orders));
  } catch (error) {
    dispatch(getAllOrdersUserFailed(error.response?.data?.message || "Something went wrong"));
  }
};

// create order (Cash on Delivery)
export const createOrder = (orderData) => async (dispatch) => {
  try {
    dispatch(createOrderRequest());
    const { data } = await axios.post(`${server}/order/create-order`, orderData, {
      withCredentials: true,
    });
    dispatch(createOrderSuccess(data.order));
    toast.success("Order placed successfully!");
    return data.order;
  } catch (error) {
    const msg = error.response?.data?.message || "Something went wrong";
    dispatch(createOrderFailed(msg));
    toast.error(msg);
    throw error;
  }
};

// create Stripe checkout session
export const createStripeOrder = (orderData) => async () => {
  try {
    const { data } = await axios.post(`${server}/order/create-stripe-order`, orderData, {
      withCredentials: true,
    });
    if (data.url) {
      window.location.href = data.url;
    }
    return data;
  } catch (error) {
    const msg = error.response?.data?.message || "Stripe payment failed";
    toast.error(msg);
    throw error;
  }
};

// verify Stripe payment after redirect
export const verifyStripePayment = (sessionId) => async (dispatch) => {
  try {
    dispatch(createOrderRequest());
    const { data } = await axios.post(`${server}/order/verify-stripe-payment`, { sessionId }, {
      withCredentials: true,
    });
    dispatch(createOrderSuccess(data.order));
    toast.success("Payment successful! Order placed.");
    return data.order;
  } catch (error) {
    const msg = error.response?.data?.message || "Payment verification failed";
    dispatch(createOrderFailed(msg));
    toast.error(msg);
    throw error;
  }
};

// create PayPal order
export const createPayPalOrder = (orderData) => async () => {
  try {
    const { data } = await axios.post(`${server}/order/create-paypal-order`, orderData, {
      withCredentials: true,
    });
    if (data.approvalUrl) {
      window.location.href = data.approvalUrl;
    }
    return data;
  } catch (error) {
    const msg = error.response?.data?.message || "PayPal order creation failed";
    toast.error(msg);
    throw error;
  }
};

// capture PayPal order after redirect
export const capturePayPalOrder = (orderId) => async (dispatch) => {
  try {
    dispatch(createOrderRequest());
    const { data } = await axios.post(`${server}/order/capture-paypal-order`, { orderId }, {
      withCredentials: true,
    });
    dispatch(createOrderSuccess(data.order));
    toast.success("PayPal payment successful! Order placed.");
    return data.order;
  } catch (error) {
    const msg = error.response?.data?.message || "PayPal capture failed";
    dispatch(createOrderFailed(msg));
    toast.error(msg);
    throw error;
  }
};
