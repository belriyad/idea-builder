/**
 * Validate payment token
 * In production, this would call the Stripe API to verify the token
 * @param {string} paymentToken - Payment token to validate
 * @returns {boolean} - Whether the payment is valid
 */
function validatePaymentToken(paymentToken) {
  if (!paymentToken) {
    return false;
  }

  // In development/testing, accept test tokens
  // Note: Ensure NODE_ENV is properly set in all environments
  const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
  
  if (isDevelopment) {
    return paymentToken === 'test_payment_token' || paymentToken.startsWith('tok_');
  }

  // In production, this should call Stripe API to validate the token
  // Example:
  // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  // try {
  //   await stripe.tokens.retrieve(paymentToken);
  //   return true;
  // } catch (error) {
  //   return false;
  // }

  // For now, only accept tokens that look like Stripe tokens in production
  return paymentToken.startsWith('tok_') && paymentToken.length > 20;
}

module.exports = {
  validatePaymentToken
};
