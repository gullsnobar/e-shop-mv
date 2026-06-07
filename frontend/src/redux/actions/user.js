import axios from "axios";
import { server } from "../../server";
import {
  loadUserRequest,
  loadUserSuccess,
  loadUserFail,
  signupRequest,
  signupSuccess,
  signupFail,
  activationRequest,
  activationSuccess,
  activationFail,
  loginRequest,
  loginSuccess,
  loginFail,
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
  clearMessages,
  logoutUser,
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

// signup user
export const signup = (name, email, password, avatar) => async (dispatch) => {
  try {
    dispatch(signupRequest());
    const { data } = await axios.post(`${server}/user/create-user`, {
      name,
      email,
      password,
      avatar,
    }, { withCredentials: true });
    dispatch(signupSuccess(data.message));
  } catch (error) {
    dispatch(signupFail(error?.response?.data?.message || "Signup failed"));
  }
};

// activate user
export const activation = (activation_token) => async (dispatch) => {
  try {
    dispatch(activationRequest());
    const { data } = await axios.post(`${server}/user/activation`, {
      activation_token,
    }, { withCredentials: true });
    localStorage.setItem("token", data.token);
    setAuthToken();
    dispatch(activationSuccess(data.user));
  } catch (error) {
    dispatch(activationFail(error?.response?.data?.message || "Activation failed"));
    localStorage.removeItem("token");
  }
};

// login user
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const { data } = await axios.post(`${server}/user/login-user`, {
      email,
      password,
    }, { withCredentials: true });
    localStorage.setItem("token", data.token);
    setAuthToken();
    dispatch(loginSuccess(data.user));
  } catch (error) {
    dispatch(loginFail(error?.response?.data?.message || "Login failed"));
    localStorage.removeItem("token");
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
    dispatch(loadSellerRequest());
    // Use seller_token specifically (separate from user token)
    const sellerToken = localStorage.getItem("seller_token");
    const config = {
      withCredentials: true,
    };
    if (sellerToken) {
      config.headers = {
        Authorization: `Bearer ${sellerToken}`,
      };
    }
    const { data } = await axios.get(`${server}/shop/getSeller`, config);
    dispatch(loadSellerSuccess(data.seller));
  } catch (error) {
    dispatch(loadSellerFail(error?.response?.data?.message || "Failed to load seller"));
    localStorage.removeItem("seller_token");
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
      successMessage: "Address deleted successfully!",
      user: data.user,
    }));
  } catch (error) {
    dispatch(deleteUserAddressFailed(error?.response?.data?.message || "Delete failed"));
  }
};

// logout user
export const logoutUserAction = () => async (dispatch) => {
  try {
    setAuthToken();
    await axios.get(`${server}/user/logout`, { withCredentials: true });
  } catch (_) {
    // ignore logout API errors
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("seller_token");
    delete axios.defaults.headers.common["Authorization"];
    dispatch(logoutUser());
  }
};

export { clearMessages };

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