import ApiError from "../utils/ApiError.js";

const notFoundHandler = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
    errors: Array.isArray(err.errors) ? err.errors : [],
    data: null,
  });
};

export { errorHandler, notFoundHandler };
