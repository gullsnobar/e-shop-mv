import axios from "axios";
import { server } from "../../server";
import {
  loadUserRequest,
  loadUserSuccess,
  loadUserFail,
  updateUserInfoRequest,
  updateUserInfoSuccess,
  updateUserInfoFailed,
  updateUserAddressRequest,
  updateUserAddressSuccess,
  updateUserAddressFailed,
  deleteUserAddressRequest,
  deleteUserAddressSuccess,
  deleteUserAddressFailed,
  getAllUsersRequest,
  getAllUsersSuccess,
  getAllUsersFailed,
  clearErrors,
} from "../reducers/user";
import {
  loadSellerRequest,
  loadSellerSuccess,
  loadSellerFail,
} from "../reducers/seller";

// Set auth token for all axios requests
const setAuthToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

// load user
export const loadUser = () => async (dispatch) => {
  try {
    setAuthToken();
    dispatch(loadUserRequest());
    const { data } = await axios.get(`${server}/user/getuser`, {
      withCredentials: true,
    });
    dispatch(loadUserSuccess(data.user));
  } catch (error) {
    dispatch(loadUserFail(error?.response?.data?.message || "Failed to load user"));
    localStorage.removeItem("token");
  }
};

// load seller
export const loadSeller = () => async (dispatch) => {
  try {
    setAuthToken();
    dispatch(loadSellerRequest());
    const { data } = await axios.get(`${server}/shop/getSeller`, {
      withCredentials: true,
    });
    dispatch(loadSellerSuccess(data.seller));
  } catch (error) {
    dispatch(loadSellerFail(error?.response?.data?.message || "Failed to load seller"));
  }
};

// user update information
export const updateUserInformation =
  (name, email, phoneNumber, password) => async (dispatch) => {
    try {
      setAuthToken();
      dispatch(updateUserInfoRequest());

      const { data } = await axios.put(
        `${server}/user/update-user-info`,
        {
          email,
          password,
          phoneNumber,
          name,
        },
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Credentials": true,
          },
        }
      );

      dispatch(updateUserInfoSuccess(data.user));
    } catch (error) {
      dispatch(updateUserInfoFailed(error?.response?.data?.message || "Update failed"));
    }
  };

// update user address
export const updatUserAddress =
  (country, city, address1, address2, zipCode, addressType) =>
  async (dispatch) => {
    try {
      setAuthToken();
      dispatch(updateUserAddressRequest());

      const { data } = await axios.put(
        `${server}/user/update-user-addresses`,
        {
          country,
          city,
          address1,
          address2,
          zipCode,
          addressType,
        },
        { withCredentials: true }
      );

      dispatch(updateUserAddressSuccess({
        successMessage: "User address updated succesfully!",
        user: data.user,
      }));
    } catch (error) {
      dispatch(updateUserAddressFailed(error?.response?.data?.message || "Update failed"));
    }
  };

// delete user address
export const deleteUserAddress = (id) => async (dispatch) => {
  try {
    setAuthToken();
    dispatch(deleteUserAddressRequest());

    const { data } = await axios.delete(
      `${server}/user/delete-user-address/${id}`,
      { withCredentials: true }
    );

    dispatch(deleteUserAddressSuccess({
      successMessage: "User deleted successfully!",
      user: data.user,
    }));
  } catch (error) {
    dispatch(deleteUserAddressFailed(error?.response?.data?.message || "Delete failed"));
  }
};

// get all users --- admin
export const getAllUsers = () => async (dispatch) => {
  try {
    setAuthToken();
    dispatch(getAllUsersRequest());

    const { data } = await axios.get(`${server}/user/admin-all-users`, {
      withCredentials: true,
    });

    dispatch(getAllUsersSuccess(data.users));
  } catch (error) {
    dispatch(getAllUsersFailed(error?.response?.data?.message || "Failed to load users"));
  }
};