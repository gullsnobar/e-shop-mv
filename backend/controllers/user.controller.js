const User = require("../model/user");
const ErrorHandler = require("../utils/ErrorHandler");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");

// Create Activation Token (sign only minimal payload)
const createActivationToken = (user) => {
  const token = jwt.sign(
    { id: user._id },
    process.env.ACTIVATION_SECRET,
    { expiresIn: "5m" }
  );
  return token;
};

// Create User 
const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log("[createUser] body:", { name, email });
    if (req.file) console.log("[createUser] file:", req.file.filename);

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

    // Note: password hashing is handled by the User model pre-save hook

    // Build avatar object if file uploaded
    let avatar = null;
    if (req.file) {
      avatar = {
        public_id: req.file.filename,
        url: `${req.protocol}://${req.get("host")}/${req.file.filename}`
      };
    }

    // Create user in DB (pass plain password so model hook hashes it)
    const newUser = await User.create({
      name,
      email,
      password: password,
      avatar: avatar || { public_id: "default", url: "https://via.placeholder.com/150" },
    });

    const activationToken = createActivationToken(newUser);
    const activationUrl = `http://localhost:3000/activate/${activationToken}`;

    // Generate JWT
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRES || "7d" }
    );

    newUser.password = undefined;

    // Send success response to client without waiting for email delivery
    res.status(201).json({
      success: true,
      message: `Please check your email: ${newUser.email} to activate your account!`,
      user: newUser,
      token,
    });

    // Attempt to send activation email in background; do not block response
    try {
      await sendMail({
        email: newUser.email,
        subject: "Activate your account",
        message: `Click on the link to activate your account: ${activationUrl}`
      });
    } catch (error) {
      console.error("Activation email failed:", error.message || error);
    }

  } catch (error) {
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }
    return next(new ErrorHandler(error.message, 500));
  }
};

// Login User 
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 2. Validate request body
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // 3. Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // 5. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    // 7. Successful login: generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRES || "7d" }
    );

    // Do not return password in response
    user.password = undefined;

    return res.status(200).json({ success: true, token, message: "Login successful" });

  } catch (error) {
    // 8. Log all errors and return JSON error without crashing
    console.log("[loginUser] error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { createUser, loginUser };