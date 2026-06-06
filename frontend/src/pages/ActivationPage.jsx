import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { activation } from "../redux/actions/user";

const ActivationPage = () => {
  const { activation_token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (activation_token) {
      dispatch(activation(activation_token));
    }
  }, [activation_token, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

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
        <p>Activating your account...</p>
      ) : error ? (
        <p>Your token is invalid or has expired.</p>
      ) : (
        <p>Your account has been created successfully.</p>
      )}
    </div>
  );
};

export default ActivationPage;