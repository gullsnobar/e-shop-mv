import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login.jsx";
import SignupPage from "./pages/Signup.jsx";
import { ActivationPage, HomePage, ProductsPage, EventsPage, BestSellingPage, FAQPage } from "./Routes.js";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { server } from "./server.js";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAllProducts } from "./redux/actions/products";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  useEffect(() => {
    axios.get(`${server}/user/me`, { withCredentials: true })
      .then((res) => {
        // optional success (can remove if not needed)
        // toast.success("User fetched successfully");
      })
      .catch((err) => {
        // fixed error handling (avoid crash if undefined)
        toast.error(err?.response?.data?.message || "Something went wrong");
      });
  }, []);

  return (
    <div className="overflow-x-hidden">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/activation/:activation_token" element={<ActivationPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/best-selling" element={<BestSellingPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/faq" element={<FAQPage />} />

        </Routes>
      </BrowserRouter>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default App;