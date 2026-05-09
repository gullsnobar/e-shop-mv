import axios from "axios";
import { server } from "../../server";
import { productData } from "../../static/data";
import { eventsLoading, eventsSuccess, eventsError } from "../reducers/event";

// create event
export const createevent = (data) => async (dispatch) => {
  try {
    dispatch(eventsLoading());

    const { d } = await axios.post(`${server}/event/create-event`, data);
    dispatch(eventsSuccess(d?.event || []));
  } catch (error) {
    dispatch(eventsError(error?.response?.data?.message || "Failed to create event"));
  }
};

// get all events of a shop
export const getAllEventsShop = (id) => async (dispatch) => {
  try {
    dispatch(eventsLoading());

    const { data } = await axios.get(`${server}/event/get-all-events/${id}`);
    dispatch(eventsSuccess(data?.events || []));
  } catch (error) {
    dispatch(eventsError(error?.response?.data?.message || "Failed to fetch shop events"));
  }
};

// delete event of a shop
export const deleteEvent = (id) => async (dispatch) => {
  try {
    dispatch(eventsLoading());

    const { data } = await axios.delete(
      `${server}/event/delete-shop-event/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch(eventsSuccess([]));
  } catch (error) {
    dispatch(eventsError(error?.response?.data?.message || "Failed to delete event"));
  }
};

// get all events
export const getAllEvents = () => async (dispatch) => {
  try {
    dispatch(eventsLoading());

    const { data } = await axios.get(`${server}/event/get-all-events`);
    dispatch(eventsSuccess(data?.events || []));
  } catch (error) {
    // Fallback: use first 2 products as mock events so section isn't empty
    const fallbackEvents = productData.slice(0, 2).map((item) => ({
      ...item,
      _id: item._id || item.id,
      name: item.name,
      description: item.description,
      images: item.images,
      discountPrice: item.discount_price ?? item.discountPrice ?? 0,
      originalPrice: item.price ?? item.originalPrice ?? 0,
      sold_out: item.total_sell ?? item.sold_out ?? 0,
    }));
    dispatch(eventsSuccess(fallbackEvents));
  }
};