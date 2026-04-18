const User = require("../model/user");
const ErrorHandler = require("../utils/ErrorHandler");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Create User 
const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      }
      return next(new ErrorHandler("Please provide all required fields", 400));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      }
      return next(new ErrorHandler("User already exists with this email", 400));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Build avatar URL if file uploaded
    const avatar = req.file
      ? `${req.protocol}://${req.get("host")}/${req.file.filename}`
      : null;

    // Create user in DB
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar,
    });

    // Generate JWT
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRES || "7d" }
    );

    newUser.password = undefined;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
      token,
    });

  } catch (error) {
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }
    return next(new ErrorHandler(error.message, 500));
  }
};

// ─── Login User ───────────────────────────────────────────────────────────────
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRES || "7d" }
    );

    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
      token,
    });

  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

module.exports = { createUser, loginUser };