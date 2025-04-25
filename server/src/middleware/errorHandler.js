/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error(err.stack);

  // Default to 500 internal server error unless we specify otherwise
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
      // Only include stack trace in development
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

module.exports = errorHandler; 