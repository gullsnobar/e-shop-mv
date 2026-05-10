const express = require("express");
const path = require("path");
const router = express.Router();
const User = require("../model/user.js");
const { upload } = require("../multer.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
const fs = require("fs");
const sendMail = require("../utils/sendMail.js");
const jwt = require("jsonwebtoken");
const catchAsyncError = require("../utils/catchAsyncErrors.js");
const sendToken = require("../utils/jwtToken.js");
const { isAuthenticated, isAdmin } = require("../middleware/auth.js");
const cloudinary = require("../cloudinary");

// -------------------------------------------------------
// Create Activation Token
// -------------------------------------------------------
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "15m",
  });
};

// -------------------------------------------------------
// Create User
// -------------------------------------------------------
router.post("/create-user", upload.single("file"), catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  const userEmail = await User.findOne({ email });
  if (userEmail) {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return next(new ErrorHandler("User already exists with this email", 400));
  }

  let avatar = {
    public_id: "default",
    url: "https://via.placeholder.com/150",
  };

  if (req.file && req.file.path) {
    const hasCloudinaryCreds = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;
    if (hasCloudinaryCreds) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, { folder: "avatars" });
        avatar = { public_id: result.public_id, url: result.secure_url };
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      } catch (cloudErr) {
        console.error("[createUser] Cloudinary upload failed:", cloudErr.message);
        avatar = { public_id: req.file.filename, url: `${req.protocol}://${req.get("host")}/${req.file.filename}` };
      }
    } else {
      avatar = { public_id: req.file.filename, url: `${req.protocol}://${req.get("host")}/${req.file.filename}` };
    }
  }

  const newUser = await User.create({ name, email, password, avatar });
  const token = newUser.getJwtToken();
  newUser.password = undefined;

  try {
    const activationToken = jwt.sign({ id: newUser._id }, process.env.ACTIVATION_SECRET, { expiresIn: "5m" });
    const activationUrl = `http://localhost:5173/activation/${activationToken}`;
    await sendMail({ email: newUser.email, subject: "Activate your account", message: `Hello ${newUser.name}, please click on the link to activate your account: ${activationUrl}` });
  } catch (emailErr) {
    console.error("[createUser] Activation email failed:", emailErr.message || emailErr);
  }

  res.status(201).json({ success: true, message: "Account created successfully!", user: newUser, token });
}));

// -------------------------------------------------------
// Activate User
// -------------------------------------------------------
router.post(
  "/activation",
  catchAsyncError(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const decoded = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      if (!decoded || !decoded.id) {
        return next(new ErrorHandler("Invalid activation token", 400));
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      sendToken(user, 200, res);
    } catch (e) {
      return next(new ErrorHandler(e.message, 500));
    }
  })
);

// -------------------------------------------------------
// Login User
// -------------------------------------------------------
router.post(
  "/login-user",
  catchAsyncError(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide all the fields", 400));
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User does not exist", 400));
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return next(new ErrorHandler("Invalid Credentials!", 400));
      }

      sendToken(user, 201, res);
    } catch (e) {
      return next(new ErrorHandler(e.message, 500));
    }
  })
);

// -------------------------------------------------------
// Load User
// -------------------------------------------------------
router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return next(new ErrorHandler("User doesn't exist", 400));
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (e) {
      return next(new ErrorHandler(e.message, 500));
    }
  })
);

// -------------------------------------------------------
// Logout User
// -------------------------------------------------------
router.get(
  "/logout",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        path: "/",
      });

      res.status(200).json({
        success: true,
        message: "Log out successful!",
      });
    } catch (e) {
      return next(new ErrorHandler(e.message, 500));
    }
  })
);

// -------------------------------------------------------
// Update User Info
// -------------------------------------------------------
router.put(
  "/update-user-info",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      const { name, email, password, phoneNumber } = req.body;

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User does not exist", 400));
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return next(new ErrorHandler("Invalid Password", 400));
      }

      if (name) user.name = name;
      if (email) user.email = email;
      if (phoneNumber) user.phoneNumber = phoneNumber;

      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (e) {
      return next(new ErrorHandler(e.message, 500));
    }
  })
);

// -------------------------------------------------------
// Update User Avatar
// -------------------------------------------------------
router.put(
  "/update-avatar",
  isAuthenticated,
  upload.single("image"),
  catchAsyncError(async (req, res, next) => {
    try {
      const existsUser = await User.findById(req.user.id);

      if (!existsUser) {
        return next(new ErrorHandler("User does not exist", 400));
      }

      const existAvatarPath = `uploads/${existsUser.avatar}`;
      if (fs.existsSync(existAvatarPath)) {
        fs.unlinkSync(existAvatarPath);
      }

      const fileUrl = req.file.filename;
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { avatar: fileUrl },
        { new: true }
      );

      res.status(200).json({
        success: true,
        user,
      });
    } catch (e) {
      return next(new ErrorHandler(e.message, 500));
    }
  })
);

// -------------------------------------------------------
// Update User Addresses
// -------------------------------------------------------
router.put(
  "/update-user-addresses",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      const sameTypeAddress = user.addresses.find(
        (address) => address.addressType === req.body.addressType
      );

      if (sameTypeAddress) {
        return next(
          new ErrorHandler(
            `${req.body.addressType} Address already exists`,
            400
          )
        );
      }

      const existsAddress = user.addresses.find(
        (address) => address._id === req.body._id
      );

      if (existsAddress) {
        Object.assign(existsAddress, req.body);
      } else {
        user.addresses.push(req.body);
      }

      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (e) {
      return next(new ErrorHandler(e.message, 500));
    }
  })
);

// -------------------------------------------------------
// Delete User Address
// -------------------------------------------------------
router.delete(
  "/delete-user-address/:id",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return next(new ErrorHandler("User does not exist", 400));
      }

      const addressId = req.params.id;

      await User.updateOne(
        { _id: req.user.id },
        { $pull: { addresses: { _id: addressId } } }
      );

      const updatedUser = await User.findById(req.user.id);

      res.status(200).json({
        success: true,
        updatedUser,
      });
    } catch (e) {
      return next(new ErrorHandler(e.message, 500));
    }
  })
);

// -------------------------------------------------------
// Change Password
// -------------------------------------------------------
router.put(
  "/update-password",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      const { oldPassword, newPassword, confirmPassword } = req.body;

      const user = await User.findById(req.user.id).select("+password");

      if (!user) {
        return next(new ErrorHandler("User does not exist", 400));
      }

      const isOldPasswordValid = await user.comparePassword(oldPassword);
      if (!isOldPasswordValid) {
        return next(new ErrorHandler("Invalid old password", 400));
      }

      if (newPassword !== confirmPassword) {
        return next(
          new ErrorHandler("New and confirm password must be same", 400)
        );
      }

      user.password = newPassword;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (e) {
      return next(new ErrorHandler(e.message, 500));
    }
  })
);

// -------------------------------------------------------
// Get User Info by ID
// -------------------------------------------------------
router.get(
  "/user-info/:id",
  catchAsyncError(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500)); // ✅ Fixed: was 'e.message'
    }
  })
);

// -------------------------------------------------------
// Get All Users (Admin)
// -------------------------------------------------------
router.get(
  "/admin-all-users",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncError(async (req, res, next) => {
    try {
      const users = await User.find().sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// -------------------------------------------------------
// Delete User (Admin)
// -------------------------------------------------------
router.delete(
  "/delete-user/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncError(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return next(new ErrorHandler("User does not exist", 400));
      }

      await User.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;