import React from "react";
import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import {
  MdOutlineAdminPanelSettings,
  MdOutlineTrackChanges,
} from "react-icons/md";
import { TbAddressBook } from "react-icons/tb";
import { RxPerson } from "react-icons/rx";
import { IoCardOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const navItems = [
  { id: 1, label: "Profile", icon: RxPerson },
  { id: 2, label: "Orders", icon: HiOutlineShoppingBag },
  { id: 3, label: "Refunds", icon: HiOutlineReceiptRefund },
  { id: 4, label: "Inbox", icon: AiOutlineMessage, external: "/inbox" },
  { id: 5, label: "Track Order", icon: MdOutlineTrackChanges },
  { id: 6, label: "Change Password", icon: RiLockPasswordLine },
  { id: 7, label: "Address", icon: TbAddressBook },
];

const ProfileSidebar = ({ setActive, active }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const logoutHandler = () => {
    axios
      .get(`${server}/user/logout`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        window.location.reload(true);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm p-3">
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <div
              key={item.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                isActive
                  ? "bg-[#3321c8]/10 text-[#3321c8] font-semibold"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
              onClick={() => {
                if (item.external) navigate(item.external);
                else setActive(item.id);
              }}
            >
              <Icon
                size={20}
                className={`flex-shrink-0 ${isActive ? "text-[#3321c8]" : ""}`}
              />
              <span className="text-[14px]">{item.label}</span>
            </div>
          );
        })}

        {/* Payment Methods - navigates to checkout/payment page */}
        <Link to="/checkout">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700">
            <IoCardOutline size={20} className="flex-shrink-0" />
            <span className="text-[14px]">Payment Methods</span>
          </div>
        </Link>

        {user && user?.role === "Admin" && (
          <Link to="/admin/dashboard">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700">
              <MdOutlineAdminPanelSettings size={20} className="flex-shrink-0" />
              <span className="text-[14px]">Admin Dashboard</span>
            </div>
          </Link>
        )}

        <div
          className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          onClick={logoutHandler}
        >
          <AiOutlineLogin size={20} className="flex-shrink-0" />
          <span className="text-[14px]">Log out</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;