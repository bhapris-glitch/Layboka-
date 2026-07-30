// config/environment.js
// Loads and validates required environment variables at boot.
// Fails fast with a clear error instead of surfacing confusing failures later.

require('dotenv').config();

const REQUIRED_IN_PRODUCTION = [
  'DATABASE_URL',
  'JWT_SECRET',
  'ENCRYPTION_KEY',
  'SHOPIFY_API_KEY',
  'SHOPIFY_API_SECRET',
  'SHOPIFY_APP_URL',
  'ANTHROPIC_API_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
];

function validateEnvironment() {
  if (process.env.NODE_ENV === 'production') {
    const missing = REQUIRED_IN_PRODUCTION.filter((key) => !process.env[key]);
    if (missing.length > 0) {
      // eslint-disable-next-line no-console
      console.error(
        `Missing required environment variables: ${missing.join(', ')}`
      );
      process.exit(1);
    }
  }
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 4000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  backendUrl: process.env.BACKEND_URL || 'http://localhost:4000',

  databaseUrl: process.env.DATABASE_URL,

  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  encryptionKey: process.env.ENCRYPTION_KEY,

  shopify: {
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecret: process.env.SHOPIFY_API_SECRET,
    appUrl: process.env.SHOPIFY_APP_URL,
    apiVersion: process.env.SHOPIFY_API_VERSION || '2025-01',
    scopes: (process.env.SHOPIFY_SCOPES || 'read_products,read_orders,read_customers,read_inventory').split(','),
    webhookSecret: process.env.SHOPIFY_WEBHOOK_SECRET,
  },

  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    // Starter/Growth default to Haiku (cost-efficient, high volume).
    // Premium/Enterprise/Trial default to Sonnet (sharper reasoning for
    // VIP-tier plans). Each is independently overridable via env vars.
    models: {
      starter: process.env.CLAUDE_STARTER_MODEL || 'claude-haiku-4-5-20251001',
      growth: process.env.CLAUDE_GROWTH_MODEL || 'claude-haiku-4-5-20251001',
      premium: process.env.CLAUDE_PREMIUM_MODEL || 'claude-sonnet-5',
      enterprise: process.env.CLAUDE_ENTERPRISE_MODEL || 'claude-sonnet-5',
      trial: process.env.CLAUDE_TRIAL_MODEL || 'claude-sonnet-5',
    },
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    prices: {
      starter: process.env.STRIPE_STARTER_PRICE_ID,
      growth: process.env.STRIPE_GROWTH_PRICE_ID,
      premium: process.env.STRIPE_PREMIUM_PRICE_ID,
    },
  },

  email: {
    providerKey: process.env.EMAIL_PROVIDER_KEY,
    from: process.env.EMAIL_FROM || 'hello@layboka.ai',
    adminEmail: process.env.ADMIN_EMAIL || 'admin@layboka.ai',
  },

  trialLengthDays: parseInt(process.env.TRIAL_LENGTH_DAYS, 10) || 7,
};

module.exports = { env, validateEnvironment };
