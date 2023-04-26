// creating and saving token to cookies
exports.loginWithToken = (user, msg, statusCode, res) => {
  const token = user.getJWTtoken(); //generating jsonwebtoken

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
  };
  // res.cookie("logintoken", token, cookieOptions).
  res.status(statusCode).json({
    success: true,
    message: msg,
    user: user,
    token: token,
  });
};

