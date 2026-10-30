import ApiError from '../utils/ApiError.js';

export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server error';

  if (err.name === 'ValidationError' && err.errors) {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}`;
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'value';
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Not authorized, invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Session expired, please log in again';
  } else if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Invalid JSON in request body';
  }

  if (statusCode >= 500) console.error(err);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && statusCode >= 500 ? { stack: err.stack } : {}),
  });
};
