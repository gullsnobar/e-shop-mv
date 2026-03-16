const mongoose = require("mongoose");

const connectDatabase = () => {
    mongoose
      .connect(process.env.DB_URL, {
        family: 4,
      })
      .then((data) => {
        console.log(`mongod connected with server: ${data.connection.host}`);
      })
      .catch((err) => {
        console.error(`Database connection failed: ${err.message}`);
        console.error("Please verify your MongoDB connection string in backend/.env");
        console.error("If using Atlas, check if your IP is whitelisted.");
      });
  };
  
  module.exports = connectDatabase;