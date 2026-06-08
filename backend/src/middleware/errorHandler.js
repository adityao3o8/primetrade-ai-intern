const { ZodError } = require("zod");
const AppError = require("../utils/AppError");

function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-unused-vars
  const _ = next;

  if (res.headersSent) return;

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Invalid request",
      details: err.issues,
    });
  }

  // Prisma unique constraint (P2002) - avoid exposing raw Prisma error
  if (err && err.code === "P2002") {
    return res.status(409).json({ message: "Resource already exists" });
  }

  // JWT errors - avoid leaking specifics
  if (err && (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Fallback: never expose raw errors in production
  if (process.env.NODE_ENV === "production") {
    return res.status(500).json({ message: "Internal server error" });
  }

  // Development: still avoid leaking ORM stack traces in the payload
  return res.status(500).json({ message: "Internal server error" });
}

module.exports = { errorHandler };

