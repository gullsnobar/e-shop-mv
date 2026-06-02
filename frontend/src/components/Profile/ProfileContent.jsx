import React, { useState } from "react";
import {
  AiOutlineArrowRight,
  AiOutlineCamera,
  AiOutlineDelete,
  AiOutlineUser,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineLock,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../../server";
import { DataGrid } from "@material-ui/data-grid";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { MdTrackChanges } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import {
  deleteUserAddress,
  loadUser,
  updatUserAddress,
  updateUserInformation,
} from "../../redux/actions/user";
import { Country, State } from "country-state-city";
import { useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { getAllOrdersOfUser } from "../../redux/actions/order";

const ProfileContent = ({ active }) => {
  const { user, loading, error, successMessage } = useSelector((state) => state.user);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhoneNumber(user.phoneNumber || "");
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch({ type: "clearMessages" });
    }
  }, [error, successMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserInformation(name, email, phoneNumber, password));
  };

  const handleImage = async (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        axios
          .put(
            `${server}/user/update-avatar`,
            { avatar: reader.result },
            { withCredentials: true }
          )
          .then((response) => {
            dispatch(loadUser());
            toast.success("avatar updated successfully!");
          })
          .catch((error) => {
            toast.error(error?.response?.data?.message || "Failed to update avatar");
          });
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div className="w-full">
      {/* ── PROFILE ── */}
      {active === 1 && (
        <>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

            .profile-root {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
              min-height: 100vh;
              background: #f0f2f8;
              padding: 28px 16px 48px;
            }

            /* ── hero banner ── */
            .hero-card {
              max-width: 860px;
              margin: 0 auto;
              border-radius: 20px 20px 0 0;
              background: linear-gradient(120deg, #3321c8 0%, #4f3fd4 60%, #6b5adf 100%);
              padding: 36px 40px 72px;
              position: relative;
              overflow: hidden;
            }
            .hero-card::after {
              content: '';
              position: absolute;
              top: -60px; right: -60px;
              width: 240px; height: 240px;
              border-radius: 50%;
              background: rgba(255,255,255,0.05);
              pointer-events: none;
            }
            .hero-card::before {
              content: '';
              position: absolute;
              bottom: -40px; left: 30%;
              width: 160px; height: 160px;
              border-radius: 50%;
              background: rgba(255,255,255,0.04);
              pointer-events: none;
            }
            .hero-label {
              font-size: 11px;
              font-weight: 500;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              color: rgba(255,255,255,0.5);
              margin: 0 0 6px;
            }
            .hero-name {
              font-size: 28px;
              font-weight: 700;
              color: #fff;
              margin: 0 0 4px;
              line-height: 1.2;
              letter-spacing: -0.3px;
            }
            .hero-email {
              font-size: 13.5px;
              color: rgba(255,255,255,0.6);
              margin: 0;
              font-weight: 400;
            }
            .hero-badge {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              background: rgba(255,255,255,0.1);
              border: 1px solid rgba(255,255,255,0.15);
              border-radius: 100px;
              padding: 5px 14px 5px 10px;
              font-size: 12px;
              font-weight: 500;
              color: rgba(255,255,255,0.85);
              margin-top: 14px;
            }
            .hero-badge-dot {
              width: 7px; height: 7px;
              border-radius: 50%;
              background: #4ade80;
              flex-shrink: 0;
            }

            /* ── avatar ── */
            .avatar-cluster {
              position: absolute;
              right: 40px;
              top: 50%;
              transform: translateY(-50%);
            }
            .avatar-ring {
              width: 110px; height: 110px;
              border-radius: 50%;
              border: 3px solid rgba(255,255,255,0.3);
              position: relative;
              background: rgba(255,255,255,0.1);
            }
            .avatar-img {
              width: 100%; height: 100%;
              border-radius: 50%;
              object-fit: cover;
            }
            .avatar-cam-btn {
              position: absolute;
              bottom: 2px; right: 2px;
              width: 30px; height: 30px;
              border-radius: 50%;
              background: #fff;
              display: flex; align-items: center; justify-content: center;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);
              cursor: pointer;
              transition: transform 0.15s ease;
              border: 2px solid #f0f2f8;
            }
            .avatar-cam-btn:hover { transform: scale(1.1); }

            /* ── form card ── */
            .form-card {
              max-width: 860px;
              margin: 0 auto 0;
              background: #fff;
              border-radius: 0 0 20px 20px;
              box-shadow: 0 4px 24px rgba(0,0,0,0.07);
              padding: 36px 40px 36px;
              position: relative;
            }

            /* ── section heading ── */
            .section-heading {
              font-size: 16px;
              font-weight: 600;
              color: #111827;
              margin: 0 0 4px;
            }
            .section-sub {
              font-size: 13px;
              color: #9ca3af;
              margin: 0 0 24px;
              font-weight: 400;
            }

            /* ── field ── */
            .field-wrap {
              display: flex;
              flex-direction: column;
              gap: 6px;
            }
            .field-label {
              font-size: 13px;
              font-weight: 500;
              color: #374151;
              letter-spacing: 0;
              text-transform: none;
            }
            .field-input-wrap {
              position: relative;
            }
            .field-icon {
              position: absolute;
              left: 13px; top: 50%;
              transform: translateY(-50%);
              color: #9ca3af;
              pointer-events: none;
              transition: color 0.15s;
            }
            .field-input {
              width: 100%;
              height: 48px;
              padding-left: 40px;
              padding-right: 14px;
              border-radius: 10px;
              border: 1.5px solid #e5e7eb;
              background: #f9fafb;
              font-family: 'Inter', sans-serif;
              font-size: 14px;
              color: #111827;
              transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
              outline: none;
              box-sizing: border-box;
            }
            .field-input::placeholder {
              color: #9ca3af;
              font-weight: 400;
            }
            .field-input:hover {
              border-color: #d1d5db;
              background: #fff;
            }
            .field-input:focus {
              border-color: #3321c8;
              background: #fff;
              box-shadow: 0 0 0 3px rgba(51,33,200,0.08);
            }
            .field-input-wrap:focus-within .field-icon {
              color: #3321c8;
            }

            /* ── divider ── */
            .divider {
              height: 1px;
              background: #f3f4f6;
              margin: 28px 0;
            }

            /* ── submit ── */
            .submit-btn {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              height: 48px;
              padding: 0 32px;
              border-radius: 10px;
              background: #3321c8;
              color: #fff;
              font-family: 'Inter', sans-serif;
              font-size: 14px;
              font-weight: 600;
              border: none;
              cursor: pointer;
              transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
              box-shadow: 0 2px 12px rgba(51,33,200,0.22);
              letter-spacing: 0;
            }
            .submit-btn:hover:not(:disabled) {
              background: #2a1ba8;
              transform: translateY(-1px);
              box-shadow: 0 4px 18px rgba(51,33,200,0.3);
            }
            .submit-btn:active:not(:disabled) {
              transform: translateY(0);
              box-shadow: 0 2px 8px rgba(51,33,200,0.2);
            }
            .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }
            .submit-btn-icon {
              width: 20px; height: 20px;
              border-radius: 50%;
              background: rgba(255,255,255,0.18);
              display: flex; align-items: center; justify-content: center;
            }

            /* spinner */
            .spin { animation: spin 0.75s linear infinite; }
            @keyframes spin { to { transform: rotate(360deg); } }

            /* ── grid ── */
            .form-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 18px;
            }
            @media (max-width: 640px) {
              .hero-card { padding: 28px 20px 60px; border-radius: 16px 16px 0 0; }
              .avatar-cluster { right: 20px; }
              .avatar-ring { width: 88px; height: 88px; }
              .hero-name { font-size: 22px; }
              .form-card { padding: 28px 20px 28px; border-radius: 0 0 16px 16px; }
              .form-grid { grid-template-columns: 1fr; }
            }
          `}</style>

          <div className="profile-root">
            {/* ── Hero Banner ── */}
            <div className="hero-card">
              <div>
                <p className="hero-label">My Account</p>
                <h1 className="hero-name">{user?.name || "Your Name"}</h1>
                <p className="hero-email">{user?.email || "your@email.com"}</p>
                <div className="hero-badge">
                  <span className="hero-badge-dot"></span>
                  Active Member
                </div>
              </div>

              <div className="avatar-cluster">
                <div className="avatar-ring">
                  <img
                    src={avatar || user?.avatar?.url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; }}
                    className="avatar-img"
                    alt="Profile"
                  />
                  <input type="file" id="image" className="hidden" onChange={handleImage} accept="image/*" />
                  <label htmlFor="image" className="avatar-cam-btn" title="Change photo">
                    <AiOutlineCamera size={15} color="#3321c8" />
                  </label>
                </div>
              </div>
            </div>

            {/* ── Form Card ── */}
            <div className="form-card">
              <p className="section-heading">Profile Information</p>
              <p className="section-sub">Update your personal details below</p>

              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  {/* Full Name */}
                  <div className="field-wrap">
                    <label className="field-label">Full Name</label>
                    <div className="field-input-wrap">
                      <AiOutlineUser size={16} className="field-icon" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                        className="field-input"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="field-wrap">
                    <label className="field-label">Email Address</label>
                    <div className="field-input-wrap">
                      <AiOutlineMail size={16} className="field-icon" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                        className="field-input"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="field-wrap">
                    <label className="field-label">Phone Number</label>
                    <div className="field-input-wrap">
                      <AiOutlinePhone size={16} className="field-icon" />
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter your phone number"
                        required
                        className="field-input"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="field-wrap">
                    <label className="field-label">Current Password</label>
                    <div className="field-input-wrap">
                      <AiOutlineLock size={16} className="field-icon" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password to confirm changes"
                        required
                        className="field-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="divider" />

                <button
                  type="submit"
                  disabled={!!loading}
                  className="submit-btn"
                >
                  {loading ? (
                    <>
                      <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      Save Changes
                      <span className="submit-btn-icon">
                        <AiOutlineArrowRight size={12} />
                      </span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </>
      )}

      {/* order */}
      {active === 2 && (
        <div>
          <AllOrders />
        </div>
      )}

      {/* Refund */}
      {active === 3 && (
        <div>
          <AllRefundOrders />
        </div>
      )}

      {/* Track order */}
      {active === 5 && (
        <div>
          <TrackOrder />
        </div>
      )}

      {/* Change Password */}
      {active === 6 && (
        <div>
          <ChangePassword />
        </div>
      )}

      {/*  user Address */}
      {active === 7 && (
        <div>
          <Address />
        </div>
      )}
    </div>
  );
};

const AllOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, []);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];
  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$ " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

const AllRefundOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, []);

  const eligibleOrders =
    orders && orders.filter((item) => item.status === "Processing refund");

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];
  eligibleOrders &&
    eligibleOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$ " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        autoHeight
        disableSelectionOnClick
      />
    </div>
  );
};

const TrackOrder = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, []);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/track/order/${params.id}`}>
              <Button>
                <MdTrackChanges size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];
  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$ " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordChangeHandler = async (e) => {
    e.preventDefault();
    await axios
      .put(
        `${server}/user/update-user-password`,
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(res.data.success);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 max-w-[600px] mx-auto">
      <h2 className="text-center text-[22px] font-bold text-gray-800 mb-8">
        Change Password
      </h2>
      <form aria-required onSubmit={passwordChangeHandler} className="space-y-5">
        <div>
          <label className="block text-[13px] font-medium text-gray-500 mb-1.5">
            Current Password
          </label>
          <input
            type="password"
            required
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full h-[48px] px-4 rounded-lg border border-gray-200 text-gray-800 text-[14px] placeholder-gray-400 focus:outline-none focus:border-[#3321c8] focus:ring-[3px] focus:ring-[#3321c8]/10 transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-gray-500 mb-1.5">
            New Password
          </label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full h-[48px] px-4 rounded-lg border border-gray-200 text-gray-800 text-[14px] placeholder-gray-400 focus:outline-none focus:border-[#3321c8] focus:ring-[3px] focus:ring-[#3321c8]/10 transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-gray-500 mb-1.5">
            Confirm New Password
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full h-[48px] px-4 rounded-lg border border-gray-200 text-gray-800 text-[14px] placeholder-gray-400 focus:outline-none focus:border-[#3321c8] focus:ring-[3px] focus:ring-[#3321c8]/10 transition-all duration-200"
          />
        </div>
        <div className="pt-2">
          <button
            type="submit"
            className="w-full h-[48px] bg-gradient-to-r from-[#3321c8] to-[#3957db] text-white font-semibold text-[14px] rounded-lg hover:from-[#2a1ba8] hover:to-[#2f4ac0] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

const Address = () => {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [addressType, setAddressType] = useState("");
  const { user, loading, error, successMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch({ type: "clearMessages" });
    }
  }, [error, successMessage, dispatch]);

  const addressTypeData = [{ name: "Default" }, { name: "Home" }, { name: "Office" }];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (addressType === "" || country === "" || city === "") {
      toast.error("Please fill all the fields!");
    } else {
      dispatch(updatUserAddress(country, city, address1, address2, zipCode, addressType));
      setOpen(false);
      setCountry("");
      setCity("");
      setAddress1("");
      setAddress2("");
      setZipCode("");
      setAddressType("");
    }
  };

  const handleDelete = (item) => {
    const id = item._id;
    dispatch(deleteUserAddress(id));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      {open && (
        <div className="fixed w-full h-screen bg-black/50 top-0 left-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[500px] max-h-[85vh] bg-white rounded-2xl shadow-xl relative overflow-y-auto">
            <div className="w-full flex justify-end p-4">
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <RxCross1 size={18} className="text-gray-600" />
              </button>
            </div>
            <h2 className="text-center text-[20px] font-bold text-gray-800 pb-6">Add New Address</h2>
            <div className="px-6 pb-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-gray-500 mb-1.5">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full h-[48px] px-3 rounded-lg border border-gray-200 text-gray-800 text-[14px] focus:outline-none focus:border-[#3321c8] focus:ring-[3px] focus:ring-[#3321c8]/10 transition-all duration-200 bg-white"
                  >
                    <option value="">Choose your country</option>
                    {Country && Country.getAllCountries().map((item) => (
                      <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-gray-500 mb-1.5">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-[48px] px-3 rounded-lg border border-gray-200 text-gray-800 text-[14px] focus:outline-none focus:border-[#3321c8] focus:ring-[3px] focus:ring-[#3321c8]/10 transition-all duration-200 bg-white"
                  >
                    <option value="">Choose your city</option>
                    {State && State.getStatesOfCountry(country).map((item) => (
                      <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-gray-500 mb-1.5">Address Line 1</label>
                  <input type="text" required value={address1} onChange={(e) => setAddress1(e.target.value)} placeholder="Enter your address"
                    className="w-full h-[48px] px-4 rounded-lg border border-gray-200 text-gray-800 text-[14px] placeholder-gray-400 focus:outline-none focus:border-[#3321c8] focus:ring-[3px] focus:ring-[#3321c8]/10 transition-all duration-200" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-gray-500 mb-1.5">Address Line 2 (Optional)</label>
                  <input type="text" value={address2} onChange={(e) => setAddress2(e.target.value)} placeholder="Apartment, suite, etc. (optional)"
                    className="w-full h-[48px] px-4 rounded-lg border border-gray-200 text-gray-800 text-[14px] placeholder-gray-400 focus:outline-none focus:border-[#3321c8] focus:ring-[3px] focus:ring-[#3321c8]/10 transition-all duration-200" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-gray-500 mb-1.5">Zip Code</label>
                  <input type="text" required value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="Enter your zip code"
                    className="w-full h-[48px] px-4 rounded-lg border border-gray-200 text-gray-800 text-[14px] placeholder-gray-400 focus:outline-none focus:border-[#3321c8] focus:ring-[3px] focus:ring-[#3321c8]/10 transition-all duration-200" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-gray-500 mb-1.5">Address Type</label>
                  <select value={addressType} onChange={(e) => setAddressType(e.target.value)}
                    className="w-full h-[48px] px-3 rounded-lg border border-gray-200 text-gray-800 text-[14px] focus:outline-none focus:border-[#3321c8] focus:ring-[3px] focus:ring-[#3321c8]/10 transition-all duration-200 bg-white">
                    <option value="">Choose address type</option>
                    {addressTypeData && addressTypeData.map((item) => (
                      <option key={item.name} value={item.name}>{item.name}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full h-[48px] bg-gradient-to-r from-[#3321c8] to-[#3957db] text-white font-semibold text-[14px] rounded-lg hover:from-[#2a1ba8] hover:to-[#2f4ac0] hover:shadow-lg transition-all duration-300 mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? "Saving..." : "Save Address"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="flex w-full items-center justify-between mb-6">
        <h2 className="text-[22px] font-bold text-gray-800">My Addresses</h2>
        <button onClick={() => setOpen(true)}
          className="px-6 h-[40px] bg-gradient-to-r from-[#3321c8] to-[#3957db] text-white text-[13px] font-semibold rounded-lg hover:from-[#2a1ba8] hover:to-[#2f4ac0] hover:shadow-md transition-all duration-300">
          + Add New
        </button>
      </div>

      <div className="space-y-4">
        {user && user.addresses.map((item, index) => (
          <div key={index}
            className="w-full bg-gray-50 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-gray-100 hover:border-[#3321c8]/20 hover:shadow-sm transition-all duration-200">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 bg-[#3321c8]/10 text-[#3321c8] text-[11px] font-semibold rounded-full uppercase tracking-wide">
                  {item.addressType}
                </span>
              </div>
              <p className="text-[14px] text-gray-700 font-medium">{item.address1} {item.address2}</p>
              <p className="text-[13px] text-gray-400 mt-0.5">{user?.phoneNumber}</p>
            </div>
            <button onClick={() => handleDelete(item)}
              className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all duration-200 self-start sm:self-center">
              <AiOutlineDelete size={18} />
            </button>
          </div>
        ))}

        {user && user.addresses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[16px] text-gray-400">You don't have any saved addresses yet.</p>
            <p className="text-[13px] text-gray-300 mt-1">Click "Add New" to add your first address.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileContent;