import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from 'react-icons/hi';
import { RxPerson } from "react-icons/rx"
import { MdOutlineTrackChanges } from "react-icons/md"
import { AiOutlineMessage, AiOutlineLogout } from "react-icons/ai"
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logoutUserAction } from '../../redux/actions/user'

const ProfileSidebar = ({ active, setActive }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const menuItems = [
    { id: 1, label: "Profile", icon: RxPerson },
    { id: 2, label: "Orders", icon: HiOutlineShoppingBag },
    { id: 3, label: "Refunds", icon: HiOutlineReceiptRefund },
    { id: 4, label: "Inbox", icon: AiOutlineMessage, action: () => navigate("/inbox") },
    { id: 5, label: "Track Order", icon: MdOutlineTrackChanges },
    { id: 6, label: "Payment Methods", icon: HiOutlineShoppingBag },
    { id: 7, label: "Address", icon: HiOutlineShoppingBag },
  ];

  const handleClick = (item) => {
    if (item.action) {
      setActive(item.id);
      item.action();
    } else {
      setActive(item.id);
    }
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
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => {
              dispatch(logoutUserAction());
              navigate("/login");
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm whitespace-nowrap text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <AiOutlineLogout size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Desktop: vertical sidebar */}
      <div className="hidden lg:block w-full bg-white shadow-sm rounded-xl p-4 pt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <div
              key={item.id}
              className={`flex items-center cursor-pointer w-full mb-6 px-2 py-2 rounded-lg transition-colors ${
                isActive ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
              onClick={() => handleClick(item)}
            >
              <Icon size={20} color={isActive ? '#2563eb' : '#9ca3af'} />
              <span className={`pl-3 text-sm ${isActive ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </div>
          );
        })}

        <div
          className="flex items-center cursor-pointer w-full mb-6 px-2 py-2 rounded-lg hover:bg-red-50 transition-colors"
          onClick={() => {
            dispatch(logoutUserAction());
            navigate("/login");
          }}
        >
          <AiOutlineLogout size={20} color="#9ca3af" />
          <span className="pl-3 text-sm text-gray-500">Logout</span>
        </div>
      </div>
    </div>
  )
}

export default ProfileSidebar