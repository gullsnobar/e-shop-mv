
import { AiOutlineFolderAdd, AiOutlineGift } from "react-icons/ai";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { VscNewFile } from "react-icons/vsc";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi";

const DashboardSideBar = ({ active }) => {
  const menuItems = [
    { id: 1, label: "Dashboard", path: "/dashboard", icon: RxDashboard },
    { id: 2, label: "All Orders", path: "/dashboard-orders", icon: FiShoppingBag },
    { id: 3, label: "All Products", path: "/dashboard-products", icon: FiPackage },
    { id: 4, label: "Create Product", path: "/dashboard-create-product", icon: AiOutlineFolderAdd },
    { id: 5, label: "All Events", path: "/dashboard-events", icon: MdOutlineLocalOffer },
    { id: 6, label: "Create Event", path: "/dashboard-create-event", icon: VscNewFile },
    { id: 7, label: "Withdraw Money", path: "/dashboard-withdraw-money", icon: CiMoneyBill },
    { id: 8, label: "Shop Inbox", path: "/dashboard-messages", icon: BiMessageSquareDetail },
    { id: 9, label: "Discount Codes", path: "/dashboard-coupouns", icon: AiOutlineGift },
    { id: 10, label: "Refunds", path: "/dashboard-refunds", icon: HiOutlineReceiptRefund },
    { id: 11, label: "Settings", path: "/settings", icon: CiSettings },
  ];

  return (
    <div className="w-full h-full bg-white overflow-y-auto py-4">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        return (
          <Link
            key={item.id}
            to={item.path}
            className={`w-full flex items-center mx-3 mb-1 px-3 py-3 rounded-lg transition-all duration-200 ${
              isActive
                ? "bg-red-50 text-red-500"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
          >
            <Icon
              size={20}
              className={`flex-shrink-0 ${isActive ? "text-red-500" : "text-gray-400"}`}
            />
            <span
              className={`hidden 800px:block pl-3 text-[14px] font-medium ${
                isActive ? "text-red-500" : "text-gray-600"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default DashboardSideBar;