// middleware/error.middleware.js
// Centralized error handler. Must be registered LAST in app.js.
// Never exposes stack traces, secrets, or internal details to the client.

const logger = require('../utils/logger');
const { env } = require('../config/environment');

// eslint-disable-next-line no-unused-vars
function errorMiddleware(err, req, res, next) {
  const status = err.statusCode || 500;

  logger.error(`${req.method} ${req.originalUrl} -> ${status}`, err.message);
  if (env.nodeEnv === 'development') {
    logger.error(err.stack);
  }

  res.status(status).json({
    success: false,
    error: {
      message: status === 500 ? 'Something went wrong. Please try again.' : err.message,
      code: err.code || 'INTERNAL_ERROR',
    },
  });
}

function notFoundMiddleware(req, res) {
  res.status(404).json({
    success: false,
    error: { message: 'Route not found', code: 'NOT_FOUND' },
  });
}

module.exports = { errorMiddleware, notFoundMiddleware };
