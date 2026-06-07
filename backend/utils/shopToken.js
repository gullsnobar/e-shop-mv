// create token and saving that in cookies
const sendShopToken = (seller, statusCode, res) => {
  const token = seller.getJwtToken();

  // Options for cookies
  const isProd = process.env.NODE_ENV === "PRODUCTION";
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
  };

  // Sanitize: remove password from seller object before sending in response
  const sellerObj = seller.toObject ? seller.toObject() : { ...seller._doc };
  delete sellerObj.password;

  res.status(statusCode).cookie("seller_token", token, options).json({
    success: true,
    seller: sellerObj,
    token,
  });
};

module.exports = sendShopToken;