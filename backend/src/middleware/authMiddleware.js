const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const { env } = require("../config/env");

function requireAuth(req, res, next) {
  const cookieToken = req.cookies?.token;
  const header = req.headers.authorization || "";
  const authToken =
    cookieToken ||
    (header.startsWith("Bearer ") ? header.slice("Bearer ".length) : "");

  if (!authToken) {
    return next(new AppError("Unauthorized", 401));
  }

  try {
    const payload = jwt.verify(authToken, env.jwtSecret);

    // Payload is created by our login endpoint.
    // We keep it minimal to reduce token size and surface.
    req.auth = {
      id: payload.sub,
      userId: payload.sub,
      role: payload.role,
    };

    return next();
  } catch (err) {
    return next(new AppError("Unauthorized", 401));
  }
}

module.exports = { requireAuth };

