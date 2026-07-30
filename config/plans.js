// config/plans.js
// Single source of truth for plan metadata and AI model routing.
// getAIModelByPlan() is the ONLY function anything should call to decide
// which Claude model a request uses — never resolve this ad hoc elsewhere,
// and NEVER accept a model name from the frontend/client.

const { env } = require('./environment');

const PLAN_DEFINITIONS = {
  TRIAL: {
    label: '5-Day Premium Trial',
    price: 0,
    model: env.anthropic.models.trial,
  },
  STARTER: {
    label: 'Starter',
    price: 25,
    stripePriceId: env.stripe.prices.starter,
    model: env.anthropic.models.starter,
  },
  GROWTH: {
    label: 'Growth',
    price: 59,
    stripePriceId: env.stripe.prices.growth,
    model: env.anthropic.models.growth,
  },
  PREMIUM: {
    label: 'Premium',
    price: 149,
    stripePriceId: env.stripe.prices.premium,
    model: env.anthropic.models.premium,
  },
  ENTERPRISE: {
    label: 'Enterprise',
    price: null, // contact sales
    model: env.anthropic.models.enterprise,
  },
};

/**
 * Resolve the Claude model ID for a given plan.
 * @param {string} plan - one of TRIAL | STARTER | GROWTH | PREMIUM | ENTERPRISE
 * @returns {string} Claude model ID
 */
function getAIModelByPlan(plan) {
  const definition = PLAN_DEFINITIONS[plan];
  if (!definition) {
    // Fail safe to the cheapest model rather than erroring the merchant's
    // chat experience if an unexpected plan value ever appears.
    return env.anthropic.models.starter;
  }
  return definition.model;
}

function getPlanDefinition(plan) {
  return PLAN_DEFINITIONS[plan] || null;
}

module.exports = { PLAN_DEFINITIONS, getAIModelByPlan, getPlanDefinition };
