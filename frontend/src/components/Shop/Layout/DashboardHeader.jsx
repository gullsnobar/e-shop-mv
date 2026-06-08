import React from "react";
import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);
  return (
    <div className="w-full h-[70px] bg-white sticky top-0 left-0 z-30 flex items-center justify-between px-6">
      <div>
        <Link to="/dashboard" className="flex items-center gap-1">
          <span className="text-[22px] font-bold text-orange-400">Shop</span>
          <span className="text-[22px] font-bold text-gray-800">O</span>
        </Link>
      </div>
      <div className="flex items-center gap-5">
        <Link to="/dashboard/cupouns" className="800px:block hidden">
          <AiOutlineGift
            color="#9ca3af"
            size={22}
            className="cursor-pointer hover:text-gray-600 transition-colors"
          />
        </Link>
        <Link to="/dashboard-events" className="800px:block hidden">
          <MdOutlineLocalOffer
            color="#9ca3af"
            size={22}
            className="cursor-pointer hover:text-gray-600 transition-colors"
          />
        </Link>
        <Link to="/dashboard-products" className="800px:block hidden">
          <FiShoppingBag
            color="#9ca3af"
            size={22}
            className="cursor-pointer hover:text-gray-600 transition-colors"
          />
        </Link>
        <Link to="/dashboard-orders" className="800px:block hidden">
          <FiPackage color="#9ca3af" size={22} className="cursor-pointer hover:text-gray-600 transition-colors" />
        </Link>
        <Link to="/dashboard-messages" className="800px:block hidden">
          <BiMessageSquareDetail
            color="#9ca3af"
            size={22}
            className="cursor-pointer hover:text-gray-600 transition-colors"
          />
        </Link>
        <Link to={`/shop/${seller?._id}`}>
          <img
            src={seller?.avatar?.url || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239ca3af'%3E👤%3C/text%3E%3C/svg%3E"}
            alt=""
            className="w-[40px] h-[40px] rounded-full object-cover ring-2 ring-gray-100"
          />
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;