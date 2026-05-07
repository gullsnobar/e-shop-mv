import axios from "axios";
import { server } from "../../server";
import { loadUserRequest, loadUserSuccess, loadUserFail } from "../reducers/user";

// load user
export const loadUser = () => async (dispatch) => {
  dispatch(loadUserRequest());

  try {
    const res = await axios.get(`${server}/user/me`, {
      withCredentials: true, // important for auth cookies
    });

    dispatch(loadUserSuccess(res.data));

  } catch (error) {
    dispatch(loadUserFail(error?.response?.data?.message || "Failed to load user"));
  }
};