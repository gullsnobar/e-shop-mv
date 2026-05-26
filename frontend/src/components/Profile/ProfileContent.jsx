import React, { useState } from "react";
import {
  AiOutlineArrowRight,
  AiOutlineCamera,
  AiOutlineDelete,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../../server";
import styles from "../../styles/styles";
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
  clearMessages,
} from "../../redux/actions/user";
import { clearErrors } from "../../redux/reducers/user";
import { Country, State } from "country-state-city";
import { useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { getAllOrdersOfUser } from "../../redux/actions/order";

const ProfileContent = ({ active }) => {
  const { user, error, successMessage } = useSelector((state) => state.user);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [zipCode, setZipCode] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhoneNumber(user.phoneNumber || "");
      if (user.addresses && user.addresses.length > 0) {
        const addr = user.addresses[0];
        setZipCode(addr.zipCode || "");
        setAddress1(addr.address1 || "");
        setAddress2(addr.address2 || "");
      }
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearMessages());
    }
  }, [error, successMessage]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (field, value) => {
    switch (field) {
      case "name":
        if (!value || value.trim().length === 0) return "Full Name is required";
        if (value.trim().length < 3) return "Name must be at least 3 characters";
        if (/^\d+$/.test(value.trim())) return "Name cannot be numbers only";
        return "";
      case "email":
        if (!value || value.trim().length === 0) return "Email is required";
        if (!emailRegex.test(value.trim())) return "Please enter a valid email address";
        return "";
      case "phoneNumber":
        if (!value || value.trim().length === 0) return "Phone Number is required";
        if (!/^\d+$/.test(value.trim())) return "Phone Number must contain only numbers";
        if (value.trim().length < 10 || value.trim().length > 15) return "Phone Number must be 10-15 digits";
        return "";
      case "zipCode":
        if (value && !/^\d+$/.test(value.trim())) return "Zip Code must contain only numbers";
        if (value && value.trim().length < 4) return "Zip Code must be at least 4 digits";
        return "";
      case "address1":
        if (value && value.trim().length > 0 && value.trim().length < 3) return "Address must be at least 3 characters";
        return "";
      case "address2":
        return "";
      case "password":
        if (!value || value.length === 0) return "Password is required to confirm changes";
        return "";
      default:
        return "";
    }
  };

  const handleBlur = (field, value) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
  };

  const handleChange = (field, value, setter) => {
    setter(value);
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: validateField("name", name),
      email: validateField("email", email),
      phoneNumber: validateField("phoneNumber", phoneNumber),
      zipCode: validateField("zipCode", zipCode),
      address1: validateField("address1", address1),
      password: validateField("password", password),
    };
    setErrors(newErrors);
    setTouched({ name: true, email: true, phoneNumber: true, zipCode: true, address1: true, password: true });
    return !Object.values(newErrors).some((err) => err !== "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the validation errors before submitting");
      return;
    }
    dispatch(updateUserInformation(name, email, phoneNumber, password));
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setAvatar(previewUrl);

    const formData = new FormData();
    formData.append("image", file);

    axios
      .put(`${server}/user/update-avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })
      .then(() => {
        dispatch(loadUser());
        toast.success("Avatar updated successfully!");
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Avatar update failed");
      });
  };

  return (
    <div className="w-full">
      {/* profile */}
      {active === 1 && (
        <div className="w-full max-w-[800px] mx-auto bg-white rounded-xl shadow-sm p-6 md:p-10">
          {/* Avatar Section */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img
                src={user?.avatar?.url || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Crect width='120' height='120' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='40' fill='%239ca3af'%3E👤%3C/text%3E%3C/svg%3E"}
                className="w-[100px] h-[100px] rounded-full object-cover ring-4 ring-gray-50"
                alt="Profile"
              />
              <label
                htmlFor="image"
                className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <AiOutlineCamera size={16} className="text-gray-500" />
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImage}
                />
              </label>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleChange("name", e.target.value, setName)}
                  onBlur={() => handleBlur("name", name)}
                  className={`w-full px-4 h-[42px] border rounded-lg text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors ${
                    errors.name && touched.name ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                />
                {errors.name && touched.name && (
                  <p className="text-[12px] text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => handleChange("email", e.target.value, setEmail)}
                  onBlur={() => handleBlur("email", email)}
                  className={`w-full px-4 h-[42px] border rounded-lg text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors ${
                    errors.email && touched.email ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                />
                {errors.email && touched.email && (
                  <p className="text-[12px] text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value, setPhoneNumber)}
                  onBlur={() => handleBlur("phoneNumber", phoneNumber)}
                  placeholder="Enter phone number..."
                  className={`w-full px-4 h-[42px] border rounded-lg text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors ${
                    errors.phoneNumber && touched.phoneNumber ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                />
                {errors.phoneNumber && touched.phoneNumber && (
                  <p className="text-[12px] text-red-500 mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Zip Code
                </label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => handleChange("zipCode", e.target.value, setZipCode)}
                  onBlur={() => handleBlur("zipCode", zipCode)}
                  placeholder="Enter zip code..."
                  className={`w-full px-4 h-[42px] border rounded-lg text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors ${
                    errors.zipCode && touched.zipCode ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                />
                {errors.zipCode && touched.zipCode && (
                  <p className="text-[12px] text-red-500 mt-1">{errors.zipCode}</p>
                )}
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Address 1
                </label>
                <input
                  type="text"
                  value={address1}
                  onChange={(e) => handleChange("address1", e.target.value, setAddress1)}
                  onBlur={() => handleBlur("address1", address1)}
                  placeholder="Enter address line 1..."
                  className={`w-full px-4 h-[42px] border rounded-lg text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors ${
                    errors.address1 && touched.address1 ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                />
                {errors.address1 && touched.address1 && (
                  <p className="text-[12px] text-red-500 mt-1">{errors.address1}</p>
                )}
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Address 2
                </label>
                <input
                  type="text"
                  value={address2}
                  onChange={(e) => handleChange("address2", e.target.value, setAddress2)}
                  onBlur={() => handleBlur("address2", address2)}
                  placeholder="Enter address line 2..."
                  className="w-full px-4 h-[42px] border border-gray-200 rounded-lg text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => handleChange("password", e.target.value, setPassword)}
                onBlur={() => handleBlur("password", password)}
                placeholder="Enter current password to confirm changes"
                autoComplete="current-password"
                className={`w-full px-4 h-[42px] border rounded-lg text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors ${
                  errors.password && touched.password ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
              />
              {errors.password && touched.password && (
                <p className="text-[12px] text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full md:w-auto px-10 h-[44px] bg-[#3a24db] text-white text-[14px] font-medium rounded-lg hover:bg-[#2f1eb5] active:bg-[#261a94] transition-colors"
              >
                Update
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
    <div className="pt-1">
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
    <div className="pt-1">
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
    <div className="pt-1">
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
        `${server}/user/update-password`,
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(res.data.message || "Password updated successfully");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Password update failed");
      });
  };
  return (
    <div className="w-full px-5">
      <h1 className="block text-[25px] text-center font-[600] text-[#000000ba] pb-2">
        Change Password
      </h1>
      <div className="w-full">
        <form
          aria-required
          onSubmit={passwordChangeHandler}
          className="flex flex-col items-center"
        >
          <div className=" w-[100%] 800px:w-[50%] mt-5">
            <label className="block pb-2">Enter your old password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className=" w-[100%] 800px:w-[50%] mt-2">
            <label className="block pb-2">Enter your new password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className=" w-[100%] 800px:w-[50%] mt-2">
            <label className="block pb-2">Enter your confirm password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <input
              className={`w-[95%] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer`}
              required
              value="Update"
              type="submit"
            />
          </div>
        </form>
      </div>
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
    <div className="w-full px-5">
      {open && (
        <div className="fixed w-full h-screen bg-[#0000004b] top-0 left-0 flex items-center justify-center ">
          <div className="w-[35%] h-[80vh] bg-white rounded shadow relative overflow-y-scroll">
            <div className="w-full flex justify-end p-3">
              <RxCross1
                size={30}
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <h1 className="text-center text-[25px] font-Poppins">
              Add New Address
            </h1>
            <div className="w-full">
              <form aria-required onSubmit={handleSubmit} className="w-full">
                <div className="w-full block p-4">
                  <div className="w-full pb-2">
                    <label className="block pb-2">Country</label>
                    <select
                      name=""
                      id=""
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-[95%] border h-[40px] rounded-[5px]"
                    >
                      <option value="" className="block border pb-2">
                        choose your country
                      </option>
                      {Country &&
                        Country.getAllCountries().map((item) => (
                          <option
                            className="block pb-2"
                            key={item.isoCode}
                            value={item.isoCode}
                          >
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="w-full pb-2">
                    <label className="block pb-2">Choose your City</label>
                    <select
                      name=""
                      id=""
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-[95%] border h-[40px] rounded-[5px]"
                    >
                      <option value="" className="block border pb-2">
                        choose your city
                      </option>
                      {State &&
                        State.getStatesOfCountry(country).map((item) => (
                          <option
                            className="block pb-2"
                            key={item.isoCode}
                            value={item.isoCode}
                          >
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="w-full pb-2">
                    <label className="block pb-2">Address 1</label>
                    <input
                      type="address"
                      className={`${styles.input}`}
                      required
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                    />
                  </div>
                  <div className="w-full pb-2">
                    <label className="block pb-2">Address 2</label>
                    <input
                      type="address"
                      className={`${styles.input}`}
                      required
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                    />
                  </div>

                  <div className="w-full pb-2">
                    <label className="block pb-2">Zip Code</label>
                    <input
                      type="number"
                      className={`${styles.input}`}
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                  </div>

                  <div className="w-full pb-2">
                    <label className="block pb-2">Address Type</label>
                    <select
                      name=""
                      id=""
                      value={addressType}
                      onChange={(e) => setAddressType(e.target.value)}
                      className="w-[95%] border h-[40px] rounded-[5px]"
                    >
                      <option value="" className="block border pb-2">
                        Choose your Address Type
                      </option>
                      {addressTypeData &&
                        addressTypeData.map((item) => (
                          <option
                            className="block pb-2"
                            key={item.name}
                            value={item.name}
                          >
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className=" w-full pb-2">
                    <input
                      type="submit"
                      className={`${styles.input} mt-5 cursor-pointer`}
                      required
                      readOnly
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-[25px] font-[600] text-[#000000ba] pb-2">
          My Addresses
        </h1>
        <div
          className={`${styles.button} !rounded-md`}
          onClick={() => setOpen(true)}
        >
          <span className="text-[#fff]">Add New</span>
        </div>
      </div>
      <br />
      {user &&
        user.addresses.map((item, index) => (
          <div
            className="w-full bg-white h-min 800px:h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10 mb-5"
            key={index}
          >
            <div className="flex items-center">
              <h5 className="pl-5 font-[600]">{item.addressType}</h5>
            </div>
            <div className="pl-8 flex items-center">
              <h6 className="text-[12px] 800px:text-[unset]">
                {item.address1} {item.address2}
              </h6>
            </div>
            <div className="pl-8 flex items-center">
              <h6 className="text-[12px] 800px:text-[unset]">
                {user && user.phoneNumber}
              </h6>
            </div>
            <div className="min-w-[10%] flex items-center justify-between pl-8">
              <AiOutlineDelete
                size={25}
                className="cursor-pointer"
                onClick={() => handleDelete(item)}
              />
            </div>
          </div>
        ))}

      {user && user.addresses.length === 0 && (
        <h5 className="text-center pt-8 text-[18px]">
          You not have any saved address!
        </h5>
      )}
    </div>
  );
};
export default ProfileContent;