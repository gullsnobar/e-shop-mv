import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from 'react-icons/hi';
import { RxPerson } from "react-icons/rx";
import { MdOutlineTrackChanges, MdOutlineLocationOn, MdOutlinePayment } from "react-icons/md";
import { AiOutlineMessage, AiOutlineLogout } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUserAction } from '../../redux/actions/user';
import { toast } from "react-toastify";

const ProfileSidebar = ({ active, setActive }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const menuItems = [
    { id: 1, label: "Profile", icon: RxPerson },
    { id: 2, label: "Orders", icon: HiOutlineShoppingBag },
    { id: 3, label: "Refunds", icon: HiOutlineReceiptRefund },
    { id: 4, label: "Inbox", icon: AiOutlineMessage, action: () => navigate("/inbox") },
    { id: 5, label: "Track Order", icon: MdOutlineTrackChanges },
    { id: 6, label: "Payment Methods", icon: MdOutlinePayment },
    { id: 7, label: "Address", icon: MdOutlineLocationOn },
  ];

  const handleClick = (item) => {
    if (item.action) {
      setActive(item.id);
      item.action();
    } else {
      setActive(item.id);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUserAction());
    toast.success("Logged out successfully", {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
    });
    setTimeout(() => {
      navigate("/login");
    }, 1600);
  };

  return (
    <div className="w-full">
      {/* Mobile: horizontal scrollable tabs */}
      <div className="lg:hidden bg-white rounded-xl shadow-sm p-2 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleClick(item)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-red-50 text-red-500 font-medium"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Icon size={16} className={isActive ? "text-red-500" : "text-gray-400"} />
                <span>{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm whitespace-nowrap text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <AiOutlineLogout size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Desktop: vertical sidebar */}
      <div className="hidden lg:block w-full bg-white rounded-xl p-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <div
              key={item.id}
              onClick={() => handleClick(item)}
              className={`flex items-center cursor-pointer w-full mb-1 px-3 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-red-50 text-red-500"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <Icon size={20} className={`flex-shrink-0 ${isActive ? "text-red-500" : "text-gray-400"}`} />
              <span className={`pl-3 text-[14px] font-medium ${isActive ? "text-red-500" : "text-gray-600"}`}>
                {item.label}
              </span>
            </div>
          );
        })}

        <div
          className="flex items-center cursor-pointer w-full mb-1 px-3 py-3 rounded-lg hover:bg-red-50 transition-all"
          onClick={handleLogout}
        >
          <AiOutlineLogout size={20} className="text-gray-400 flex-shrink-0" />
          <span className="pl-3 text-[14px] font-medium text-gray-600 hover:text-red-500">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;