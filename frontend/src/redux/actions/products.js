import axios from "axios";
import { server } from "../../server";
import { productData } from "../../static/data";
import { productsLoading, productsSuccess, productsError } from "../reducers/products";

export const getAllProducts = () => async (dispatch) => {
  try {
    dispatch(productsLoading());
    const { data } = await axios.get(`${server}/product/get-all-products`);
    dispatch(productsSuccess(data.products));
  } catch (error) {
    // Fallback to static data if API fails
    const normalized = productData.map((item) => ({
      ...item,
      _id: item._id || item.id,
      discountPrice: item.discount_price ?? item.discountPrice ?? 0,
      originalPrice: item.price ?? item.originalPrice ?? 0,
      sold_out: item.total_sell ?? item.sold_out ?? 0,
      ratings: item.rating ?? item.ratings ?? 0,
      shop: {
        ...item.shop,
        _id: item.shop?._id || item.id,
      },
    }));
    dispatch(productsSuccess(normalized));
  }
};
