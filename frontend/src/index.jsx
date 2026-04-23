import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux"; // fixed import
import Store from "./redux/store";

// React 18 correct root setup
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={Store}>
    <App />
  </Provider>
);

reportWebVitals();