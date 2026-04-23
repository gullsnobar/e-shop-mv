import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const server = "http://localhost:5000/api/v1"; // adjust to your backend

const ActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activation_token) {
      const activateEmail = async () => {
        try {
          const res = await axios.post(`${server}/activation`, {
            activation_token,
          });

          console.log(res.data);
          setLoading(false);
        } catch (err) {
          console.log(err.response?.data?.message);
          setError(true);
          setLoading(false);
        }
      };

      activateEmail();
    }
  }, [activation_token]);

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