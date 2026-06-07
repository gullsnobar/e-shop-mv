// create token and saving that in cookies
const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  // Options for cookies
  const isProd = process.env.NODE_ENV === "PRODUCTION";
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
  };

  // Sanitize: remove password from user object before sending in response
  const userObj = user.toObject ? user.toObject() : { ...user._doc };
  delete userObj.password;

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user: userObj,
    token,
  });
};

module.exports = sendToken;