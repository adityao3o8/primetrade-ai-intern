const { ZodError } = require("zod");
const AppError = require("../utils/AppError");

function validateBody(schema) {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        return next(new AppError("Invalid request body", 400, err.issues));
      }
      return next(err);
    }
  };
}

function validateParams(schema) {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req.params);
      req.params = parsed;
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        return next(new AppError("Invalid request parameters", 400, err.issues));
      }
      return next(err);
    }
  };
}

module.exports = { validateBody, validateParams };

