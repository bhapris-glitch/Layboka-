// server.js
// Entry point. Validates environment, then starts the HTTP server.

const { env, validateEnvironment } = require('./config/environment');
const logger = require('./utils/logger');

validateEnvironment();

const app = require('./app');

const server = app.listen(env.port, () => {
  logger.info(`Layboka backend running on port ${env.port} [${env.nodeEnv}]`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => process.exit(0));
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection:', reason);
});
