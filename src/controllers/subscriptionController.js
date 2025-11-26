const { data, generateId } = require('../models/dataStore');
const { validatePaymentToken } = require('../utils/payment');

/**
 * Get available subscription plans
 */
async function getPlans(req, res) {
  try {
    const plans = Array.from(data.plans.values());
    res.json(plans);
  } catch (error) {
    console.error('Error retrieving plans:', error);
    res.status(500).json({ error: 'Failed to retrieve plans' });
  }
}

/**
 * Subscribe to a plan
 */
async function subscribe(req, res) {
  try {
    const partnerId = req.user.id;
    const { plan_type, payment_token } = req.body;

    if (!plan_type || !payment_token) {
      return res.status(400).json({ error: 'plan_type and payment_token are required' });
    }

    const plan = data.plans.get(plan_type);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // Verify payment
    if (!validatePaymentToken(payment_token)) {
      return res.status(402).json({ error: 'Payment verification failed' });
    }

    // Create subscription
    const subscriptionId = generateId();
    const startDate = new Date();
    const endDate = new Date();
    
    if (plan_type === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (plan_type === 'annual') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const subscription = {
      id: subscriptionId,
      partner_id: partnerId,
      plan_type,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      status: 'active'
    };

    data.subscriptions.set(subscriptionId, subscription);

    res.status(201).json({
      subscription_id: subscriptionId,
      plan_type,
      status: 'active',
      start_date: subscription.start_date,
      end_date: subscription.end_date,
      message: 'Subscription activated successfully'
    });
  } catch (error) {
    console.error('Error subscribing:', error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
}

/**
 * Cancel subscription
 */
async function cancelSubscription(req, res) {
  try {
    const partnerId = req.user.id;
    const { subscription_id } = req.body;

    if (!subscription_id) {
      return res.status(400).json({ error: 'subscription_id is required' });
    }

    const subscription = data.subscriptions.get(subscription_id);

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    if (subscription.partner_id !== partnerId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    subscription.status = 'cancelled';
    data.subscriptions.set(subscription_id, subscription);

    res.json({
      subscription_id,
      status: 'cancelled',
      message: 'Subscription cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
}

module.exports = {
  getPlans,
  subscribe,
  cancelSubscription
};
