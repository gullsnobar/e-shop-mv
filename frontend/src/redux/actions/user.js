import axios from "axios";
import { server } from "../server"; // make sure path is correct

// load user
export const loadUser = () => async (dispatch) => {
  dispatch({ type: "LoadUserRequest" });

  try {
    const res = await axios.get(`${server}/user/me`, {
      withCredentials: true, // important for auth cookies
    });

    dispatch({
      type: "LoadUserSuccess",
      payload: res.data,
    });

  } catch (error) {
    dispatch({
      type: "LoadUserFail",
      payload: error?.response?.data?.message || "Failed to load user",
    });
  }
};