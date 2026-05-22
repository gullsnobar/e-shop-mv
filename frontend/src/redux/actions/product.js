import axios from "axios";
import { server } from "../../server";
import {
  getAllProductsShopRequest,
  getAllProductsShopSuccess,
  getAllProductsShopFailed,
} from "../reducers/products";

// get all products of a shop
export const getAllProductsShop = (id) => async (dispatch) => {
  try {
    dispatch(getAllProductsShopRequest());

    const { data } = await axios.get(`${server}/product/get-all-products-shop/${id}`);

    dispatch(getAllProductsShopSuccess(data.products));
  } catch (error) {
    dispatch(getAllProductsShopFailed(error.response?.data?.message || "Something went wrong"));
  }
};
