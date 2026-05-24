import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login.jsx";
import SignupPage from "./pages/Signup.jsx";
import { ActivationPage, HomePage, ProductsPage, EventsPage, BestSellingPage, FAQPage, ProductDetailsPage, ProfilePage, CheckoutPage, PaymentPage, OrderPage, ShopCreatePage, ShopLoginPage } from "./Routes.js";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAllProducts } from "./redux/actions/products";
import { loadUser } from "./redux/actions/user";
import ProtectedRoute from "./ProtectedRoute"
import { useSelector } from "react-redux";

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      dispatch(loadUser());
    }
  }, [dispatch]);

  return (
    <div className="overflow-x-hidden">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/activation/:activation_token" element={<ActivationPage />} />
          <Route path="/products" element={<ProductsPage />} />
           <Route path="/products/:name" element={<ProductDetailsPage />} />
          <Route path="/best-selling" element={<BestSellingPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/profile" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/order/success/:id" element={<OrderPage />} />
          <Route path="/shop-login" element={<ShopLoginPage />} />
          <Route path="/shop-create" element={<ShopCreatePage />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default App;