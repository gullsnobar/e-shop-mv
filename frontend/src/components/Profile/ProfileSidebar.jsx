
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

  return (
    <div className='w-full bg-white shadow-sm rounded-[10px] p-4 pt-8'>

      {/* Profile */}
      <div
        className='flex items-center cursor-pointer w-full mb-8'
        onClick={() => setActive(1)}
      >
        <RxPerson size={20} color={active === 1 ? 'red' : '#ccc'} />
        <span className={`pl-3 ${active === 1 ? 'text-red-500' : 'text-gray-500'}`}>
          Profile
        </span>
      </div>

      {/* Orders */}
      <div
        className='flex items-center cursor-pointer w-full mb-8'
        onClick={() => setActive(2)}
      >
        <HiOutlineShoppingBag size={20} color={active === 2 ? 'red' : '#ccc'} />
        <span className={`pl-3 ${active === 2 ? 'text-red-500' : 'text-gray-500'}`}>
          Orders
        </span>
      </div>

      {/* Refunds */}
      <div
        className='flex items-center cursor-pointer w-full mb-8'
        onClick={() => setActive(3)}
      >
        <HiOutlineReceiptRefund size={20} color={active === 3 ? 'red' : '#ccc'} />
        <span className={`pl-3 ${active === 3 ? 'text-red-500' : 'text-gray-500'}`}>
          Refunds
        </span>
      </div>

      {/* Inbox */}
      <div
        className='flex items-center cursor-pointer w-full mb-8'
        onClick={() => {
          setActive(4)
          navigate("/inbox")
        }}
      >
        <AiOutlineMessage size={20} color={active === 4 ? 'red' : '#ccc'} />
        <span className={`pl-3 ${active === 4 ? 'text-red-500' : 'text-gray-500'}`}>
          Inbox
        </span>
      </div>

      {/* Track Order */}
      <div
        className='flex items-center cursor-pointer w-full mb-8'
        onClick={() => setActive(5)}
      >
        <MdOutlineTrackChanges size={20} color={active === 5 ? 'red' : '#ccc'} />
        <span className={`pl-3 ${active === 5 ? 'text-red-500' : 'text-gray-500'}`}>
          Track Order
        </span>
      </div>

      {/* Payment Methods */}
      <div
        className='flex items-center cursor-pointer w-full mb-8'
        onClick={() => setActive(6)}
      >
        <HiOutlineShoppingBag size={20} color={active === 6 ? 'red' : '#ccc'} />
        <span className={`pl-3 ${active === 6 ? 'text-red-500' : 'text-gray-500'}`}>
          Payment Methods
        </span>
      </div>

      {/* Address */}
      <div
        className='flex items-center cursor-pointer w-full mb-8'
        onClick={() => setActive(7)}
      >
        <HiOutlineShoppingBag size={20} color={active === 7 ? 'red' : '#ccc'} />
        <span className={`pl-3 ${active === 7 ? 'text-red-500' : 'text-gray-500'}`}>
          Address
        </span>
      </div>

      {/* Logout */}
      <div
        className='flex items-center cursor-pointer w-full mb-8'
        onClick={() => {
          dispatch(logoutUserAction());
          navigate("/login");
        }}
      >
        <AiOutlineLogout size={20} color={active === 8 ? 'red' : '#ccc'} />
        <span className={`pl-3 ${active === 8 ? 'text-red-500' : 'text-gray-500'}`}>
          Logout
        </span>
      </div>

    </div>
  )
}

export default ProfileSidebar