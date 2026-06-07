import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { server } from "../server";
import { loadSellerSuccess } from "../redux/reducers/seller";

const SellerActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (activation_token) {
      const sendRequest = async () => {
        try {
          const res = await axios.post(
            `${server}/shop/activation`,
            { activation_token },
            { withCredentials: true }
          );

          // Store seller token in localStorage for session persistence
          if (res.data.token) {
            localStorage.setItem("seller_token", res.data.token);
          }

          // Update Redux seller state so SellerProtectedRoute allows access
          if (res.data.seller) {
            dispatch(loadSellerSuccess(res.data.seller));
          }

          setLoading(false);

          // Redirect to seller dashboard after successful activation
          navigate("/dashboard");
        } catch (err) {
          setError(true);
          setLoading(false);
        }
      };
      sendRequest();
    }
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {loading ? (
        <p>Activating your shop account...</p>
      ) : error ? (
        <p>Your token is expired!</p>
      ) : (
        <p>Your account has been created suceessfully!</p>
      )}
    </div>
  );
};

export default SellerActivationPage;