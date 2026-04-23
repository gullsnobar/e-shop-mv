import { configureStore } from "@reduxjs/toolkit"; // fixed package name
import { userReducer } from "./reducers/user"; // correct import name

const Store = configureStore({
  reducer: {
    user: userReducer, // fixed colon (not semicolon)
  },
});

export default Store;