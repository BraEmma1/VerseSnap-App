const errorHandler = (err, req, res, next) => {
  console.error('[Error] -', err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    // Add stack trace only if we're not in production (assuming NODE_ENV logic later)
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

export default errorHandler;
