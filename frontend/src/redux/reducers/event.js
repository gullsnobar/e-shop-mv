import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  events: [],
  isLoading: false,
  error: null,
  success: false,
};

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    eventsLoading: (state) => {
      state.isLoading = true;
      state.success = false;
      state.error = null;
    },
    eventsSuccess: (state, action) => {
      state.isLoading = false;
      state.events = action.payload;
      state.error = null;
    },
    eventsError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    },
    createEventSuccess: (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.error = null;
    },
    clearEventState: (state) => {
      state.success = false;
      state.error = null;
    },
  },
});

export const { eventsLoading, eventsSuccess, eventsError, createEventSuccess, clearEventState } =
  eventSlice.actions;
export const eventsReducer = eventSlice.reducer;
