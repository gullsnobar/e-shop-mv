import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  events: [],
  isLoading: false,
  error: null,
};

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    eventsLoading: (state) => {
      state.isLoading = true;
    },
    eventsSuccess: (state, action) => {
      state.isLoading = false;
      state.events = action.payload;
      state.error = null;
    },
    eventsError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { eventsLoading, eventsSuccess, eventsError } = eventSlice.actions;
export const eventsReducer = eventSlice.reducer;
