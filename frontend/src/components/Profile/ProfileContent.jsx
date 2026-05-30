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
  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);
  const [phoneNumber, setPhoneNumber] = useState(user && user.phoneNumber);
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
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
            {
              withCredentials: true,
            }
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
      {/* profile */}
      {active === 1 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 max-w-[800px] mx-auto">
          {/* Avatar */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <img
                src={avatar || user?.avatar?.url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; }}
                className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3321c8] shadow-[0_0_20px_rgba(51,33,200,0.15)] transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_0_30px_rgba(51,33,200,0.25)]"
                alt=""
              />
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer">
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  onChange={handleImage}
                  accept="image/*"
                />
                <label
                  htmlFor="image"
                  className="absolute inset-0 rounded-full flex items-center justify-center cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <AiOutlineCamera size={22} className="text-white" />
                  </div>
                </label>
              </div>
            </div>
          </div>

          <h2 className="text-center text-[22px] font-bold text-gray-800 mb-8">
            Profile Information
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-[13px] font-medium text-gray-500 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <AiOutlineUser size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full h-[48px] pl-10 pr-4 rounded-lg border border-gray-200 text-gray-800 text-[14px] placeholder-gray-400 focus:outline-none focus:border-[#3321c8] focus:ring-[3px] focus:ring-[#3321c8]/10 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[13px] font-medium text-gray-500 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <AiOutlineMail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-[48px] pl-10 pr-4 rounded-lg border border-gray-200 text-gray-800 text-[14px] placeholder-gray-400 focus:outline-none focus:border-[#3321c8] focus:ring-[3px] focus:ring-[#3321c8]/10 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[13px] font-medium text-gray-500 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <AiOutlinePhone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="w-full h-[48px] pl-10 pr-4 rounded-lg border border-gray-200 text-gray-800 text-[14px] placeholder-gray-400 focus:outline-none focus:border-[#3321c8] focus:ring-[3px] focus:ring-[#3321c8]/10 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[13px] font-medium text-gray-500 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <AiOutlineLock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter password to confirm changes"
                    className="w-full h-[48px] pl-10 pr-4 rounded-lg border border-gray-200 text-gray-800 text-[14px] placeholder-gray-400 focus:outline-none focus:border-[#3321c8] focus:ring-[3px] focus:ring-[#3321c8]/10 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-10 h-[48px] bg-gradient-to-r from-[#3321c8] to-[#3957db] text-white font-semibold text-[14px] rounded-lg hover:from-[#2a1ba8] hover:to-[#2f4ac0] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
              >
                {user?.loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                    Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </button>
            </div>
          </form>
        </div>
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
      <form
        aria-required
        onSubmit={passwordChangeHandler}
        className="space-y-5"
      >
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
  const [zipCode, setZipCode] = useState();
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [addressType, setAddressType] = useState("");
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const addressTypeData = [
    {
      name: "Default",
    },
    {
      name: "Home",
    },
    {
      name: "Office",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (addressType === "" || country === "" || city === "") {
      toast.error("Please fill all the fields!");
    } else {
      dispatch(
        updatUserAddress(
          country,
          city,
          address1,
          address2,
          zipCode,
          addressType
        )
      );
      setOpen(false);
      setCountry("");
      setCity("");
      setAddress1("");
      setAddress2("");
      setZipCode(null);
      setAddressType("");
    }
  };

  const handleDelete = (item) => {
    const id = item._id;
    dispatch(deleteUserAddress(id));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      {/* Modal */}
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
            <h2 className="text-center text-[20px] font-bold text-gray-800 pb-6">
              Add New Address
            </h2>
            <div className="px-6 pb-8">
              <form aria-required onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-gray-500 mb-1.5">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full h-[48px] px-3 rounded-lg border border-gray-200 text-gray-800 text-[14px] focus:outline-none focus:border-[#3321c8] focus:ring-[3px] focus:ring-[#3321c8]/10 transition-all duration-200 bg-white"
                  >
                    <option value="">Choose your country</option>
                    {Country && Country.getAllCountries().map((item) => (
                      <option key={item.isoCode} value={item.isoCode}>
                        {item.name}
                      </option>
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
                      <option key={item.isoCode} value={item.isoCode}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-gray-500 mb-1.5">Address Line 1</label>
                  <input
                    type="text"
                    required
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    className="w-full h-[48px] px-4 rounded-lg border border-gray-200 text-gray-800 text-[14px] placeholder-gray-400 focus:outline-none focus:border-[#3321c8] focus:ring-[3px] focus:ring-[#3321c8]/10 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-gray-500 mb-1.5">Address Line 2</label>
                  <input
                    type="text"
                    required
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    className="w-full h-[48px] px-4 rounded-lg border border-gray-200 text-gray-800 text-[14px] placeholder-gray-400 focus:outline-none focus:border-[#3321c8] focus:ring-[3px] focus:ring-[#3321c8]/10 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-gray-500 mb-1.5">Zip Code</label>
                  <input
                    type="number"
                    required
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full h-[48px] px-4 rounded-lg border border-gray-200 text-gray-800 text-[14px] placeholder-gray-400 focus:outline-none focus:border-[#3321c8] focus:ring-[3px] focus:ring-[#3321c8]/10 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-gray-500 mb-1.5">Address Type</label>
                  <select
                    value={addressType}
                    onChange={(e) => setAddressType(e.target.value)}
                    className="w-full h-[48px] px-3 rounded-lg border border-gray-200 text-gray-800 text-[14px] focus:outline-none focus:border-[#3321c8] focus:ring-[3px] focus:ring-[#3321c8]/10 transition-all duration-200 bg-white"
                  >
                    <option value="">Choose address type</option>
                    {addressTypeData && addressTypeData.map((item) => (
                      <option key={item.name} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full h-[48px] bg-gradient-to-r from-[#3321c8] to-[#3957db] text-white font-semibold text-[14px] rounded-lg hover:from-[#2a1ba8] hover:to-[#2f4ac0] hover:shadow-lg transition-all duration-300 mt-2"
                >
                  Save Address
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex w-full items-center justify-between mb-6">
        <h2 className="text-[22px] font-bold text-gray-800">
          My Addresses
        </h2>
        <button
          onClick={() => setOpen(true)}
          className="px-6 h-[40px] bg-gradient-to-r from-[#3321c8] to-[#3957db] text-white text-[13px] font-semibold rounded-lg hover:from-[#2a1ba8] hover:to-[#2f4ac0] hover:shadow-md transition-all duration-300"
        >
          + Add New
        </button>
      </div>

      {/* Address Cards */}
      <div className="space-y-4">
        {user && user.addresses.map((item, index) => (
          <div
            key={index}
            className="w-full bg-gray-50 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-gray-100 hover:border-[#3321c8]/20 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 bg-[#3321c8]/10 text-[#3321c8] text-[11px] font-semibold rounded-full uppercase tracking-wide">
                  {item.addressType}
                </span>
              </div>
              <p className="text-[14px] text-gray-700 font-medium">
                {item.address1} {item.address2}
              </p>
              <p className="text-[13px] text-gray-400 mt-0.5">
                {user?.phoneNumber}
              </p>
            </div>
            <button
              onClick={() => handleDelete(item)}
              className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all duration-200 self-start sm:self-center"
            >
              <AiOutlineDelete size={18} />
            </button>
          </div>
        ))}

        {user && user.addresses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[16px] text-gray-400">
              You don't have any saved addresses yet.
            </p>
            <p className="text-[13px] text-gray-300 mt-1">
              Click "Add New" to add your first address.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default ProfileContent;