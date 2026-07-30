// utils/logger.js
// Minimal structured logger. Swap for pino/winston later without touching callers.

const { env } = require('../config/environment');

function timestamp() {
  return new Date().toISOString();
}

const logger = {
  info: (...args) => console.log(`[INFO] ${timestamp()}`, ...args),
  warn: (...args) => console.warn(`[WARN] ${timestamp()}`, ...args),
  error: (...args) => console.error(`[ERROR] ${timestamp()}`, ...args),
  debug: (...args) => {
    if (env.nodeEnv === 'development') {
      console.debug(`[DEBUG] ${timestamp()}`, ...args);
    }
  },
};

module.exports = logger;
