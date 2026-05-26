import React, { useState, useEffect } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const [fullName, setFullName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("shippingAddress");
    if (saved) {
      const data = JSON.parse(saved);
      setFullName(data.fullName || "");
      setAddress1(data.address1 || "");
      setAddress2(data.address2 || "");
      setCity(data.city || "");
      setCountry(data.country || "");
      setZipCode(data.zipCode || "");
      setPhoneNumber(data.phoneNumber || "");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cart || cart.length === 0) {
      return;
    }
    const shippingAddress = {
      fullName,
      address1,
      address2,
      city,
      country,
      zipCode,
      phoneNumber,
    };
    localStorage.setItem("shippingAddress", JSON.stringify(shippingAddress));
    navigate("/payment");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="max-w-[900px] mx-auto px-4 py-8">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="flex items-center">
            <div className="bg-[#e44343] text-white px-4 py-2 rounded-full text-sm font-medium">
              1.Shipping
            </div>
            <div className="w-10 h-0.5 bg-[#e44343] mx-1"></div>
          </div>
          <div className="flex items-center">
            <div className="bg-[#ffcccc] text-[#e44343] px-4 py-2 rounded-full text-sm font-medium">
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

        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Shipping Address</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 h-[42px] border border-gray-200 rounded-lg text-[14px] text-gray-800 focus:outline-none focus:border-gray-400 transition-colors"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Address Line 1</label>
                <input
                  type="text"
                  required
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  className="w-full px-4 h-[42px] border border-gray-200 rounded-lg text-[14px] text-gray-800 focus:outline-none focus:border-gray-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Address Line 2</label>
                <input
                  type="text"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  className="w-full px-4 h-[42px] border border-gray-200 rounded-lg text-[14px] text-gray-800 focus:outline-none focus:border-gray-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 h-[42px] border border-gray-200 rounded-lg text-[14px] text-gray-800 focus:outline-none focus:border-gray-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Country</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 h-[42px] border border-gray-200 rounded-lg text-[14px] text-gray-800 focus:outline-none focus:border-gray-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Zip Code</label>
                <input
                  type="text"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full px-4 h-[42px] border border-gray-200 rounded-lg text-[14px] text-gray-800 focus:outline-none focus:border-gray-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 h-[42px] border border-gray-200 rounded-lg text-[14px] text-gray-800 focus:outline-none focus:border-gray-400 transition-colors"
                />
              </div>
            </div>
            <div className="pt-4">
              <button
                type="submit"
                disabled={!cart || cart.length === 0}
                className={`w-full md:w-auto px-10 h-[44px] rounded-lg text-white text-[14px] font-medium transition-colors ${
                  !cart || cart.length === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#e44343] hover:bg-[#c93333]"
                }`}
              >
                Continue to Payment
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
