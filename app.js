// app.js
// Express application setup. No listen() here — that's server.js's job,
// which keeps this file testable in isolation.

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { env } = require('./config/environment');
const { errorMiddleware, notFoundMiddleware } = require('./middleware/error.middleware');

const app = express();

// --- Security & core middleware ---
app.use(helmet());
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'));

// Stripe webhooks need the raw body for signature verification, so that
// route is mounted with express.raw() BEFORE the global json() parser.
// (wired here once webhook.routes.js is added — see Phase 6/10)
// app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }), stripeWebhookRoutes);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// --- Global rate limiting (route-specific limits layer on top later) ---
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', globalLimiter);

// --- Health check ---
app.get('/health', (req, res) => {
  res.json({ status: 'ok', env: env.nodeEnv, timestamp: new Date().toISOString() });
});

// --- API routes ---
// Mounted incrementally as each phase is built:
// app.use('/api/auth', require('./routes/auth.routes'));
// app.use('/api/shopify', require('./routes/shopify.routes'));
// app.use('/api/installation', require('./routes/installation.routes'));
// app.use('/api/chat', require('./routes/chat.routes'));
// app.use('/api/subscription', require('./routes/subscription.routes'));
// app.use('/api/payment', require('./routes/payment.routes'));
// app.use('/api/enterprise', require('./routes/enterprise.routes'));
// app.use('/api/analytics', require('./routes/analytics.routes'));
// app.use('/api/webhooks', require('./routes/webhook.routes'));

// --- 404 + centralized error handling (must be last) ---
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
