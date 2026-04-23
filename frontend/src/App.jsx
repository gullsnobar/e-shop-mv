import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login.jsx";
import SignupPage from "./pages/Signup.jsx";
import { ActivationPage } from "./Routes.js";
import "./App.css";
import { ToastContainer, toast } from "react-toastify"; // added toast
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { server } from "./server.js";
import { useEffect } from "react";

const App = () => {

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
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* dynamic param fixed */}
          <Route path="/activation/:activation_token" element={<ActivationPage />} />
        </Routes>
      </BrowserRouter>

      {/* now properly used */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default App;