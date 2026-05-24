const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use("/", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// import routes
const user = require("./controller/user");
const shop = require("./controller/shop");

app.use("/api/v2/user", user);
app.use("/api/v2/shop", shop);

// it's for ErrorHandling
app.use(ErrorHandler);

module.exports = app;