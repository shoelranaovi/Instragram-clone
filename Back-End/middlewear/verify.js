const errorHandeler = require("./error");
const jwt = require("jsonwebtoken");
const verify = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return next(errorHandeler(400, "user not authentication"));
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return next(errorHandeler(400, "user not authentication"));
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
  }
};
module.exports = verify;
