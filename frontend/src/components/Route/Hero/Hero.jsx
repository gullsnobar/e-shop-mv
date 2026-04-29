import React from "react";
import styles from "../../../styles/styles";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div
      className={`relative min-h-[70vh] md:min-h-[88vh] w-full bg-center bg-cover flex items-center`}
      style={{
        backgroundImage:
          "url(https://themes.rslahmed.dev/rafcart/assets/images/banner-2.jpg)",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className={`${styles.section} w-[90%] md:w-[65%] relative`}>
        <h1 className="text-[32px] md:text-[58px] font-bold leading-tight capitalize text-white">
          Best Collection for <br />
          <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Home Decoration
          </span>
        </h1>

        <p className="mt-5 text-[16px] md:text-[18px] text-gray-200 leading-relaxed">
          Discover premium home décor items designed to bring comfort and style
          to your living space. Handpicked collections that fit every modern
          lifestyle.
        </p>

        <Link to="/products" className="inline-block">
          <button className="mt-7 px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[17px] font-medium shadow-lg hover:scale-105 transition-transform">
            Shop Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;