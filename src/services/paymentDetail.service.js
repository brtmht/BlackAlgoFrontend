const httpStatus = require('http-status');
const { PaymentDetail } = require('../models');
const { SubscriptionPlan } = require('../models');
const { StripeAccount } = require('../models');
const ApiError = require('../utils/ApiError');
// eslint-disable-next-line import/order
const Stripe = require('stripe')(process.env.STRIPE_KEY);

/**
 * Create a subscriptionPlan
 * @param {Object} paymentData
 * @returns {Promise<>}
 */
// eslint-disable-next-line camelcase
const savePaymentDetails = async (paymentData, stripeData, reqData) => {
  const trasactionData = await PaymentDetail.create({
    userId: stripeData.userId,
    amount: reqData.amount,
    portfolioAmount: reqData.portfolioAmount,
    paymentToken: paymentData.paymentIntent.client_secret,
    stripeAccountId: stripeData.id,
    subscriptionPlanId: reqData.subscriptionplanId,
  });

  if (!trasactionData) {
    throw new ApiError(httpStatus['201_MESSAGE'], 'transaction failed at details');
  }
  return trasactionData;
};

// To update payment details after a transaction is processed
const updatePaymentDetails = async (reqData) => {
  let subscription;
  if (reqData.subscriptionPlanId) {
    const paymentDetails = await PaymentDetail.findOne({ paymentToken: reqData.paymentToken });
    const customerData = await StripeAccount.findById(paymentDetails.stripeAccountId);
    const planId = await SubscriptionPlan.findOne({ _id: reqData.subscriptionPlanId });
    if (planId.name === 'Monthly') {
      // create subscription
      subscription = await Stripe.subscriptions.create({
        customer: customerData.customerId,
        items: [{ price: planId.subscriptionPlanId }],
        default_payment_method: reqData.paymentMethod,
      });
    }
    if (planId.name === 'Yearly') {
      const product = await Stripe.products.create({ name: 'Yearly' });
      const price = await Stripe.prices.create({
        unit_amount: paymentDetails.amount * 100,
        currency: 'usd',
        recurring: { interval: 'year' },
        product: product.id,
      });

      subscription = await Stripe.subscriptions.create({
        customer: customerData.customerId,
        items: [{ price: price.id }],
        default_payment_method: reqData.paymentMethod,
      });
    }
  }
  const udatedPaymentDetail = await PaymentDetail.updateOne(
    { paymentToken: reqData.paymentToken },
    {
      $set: {
        ...reqData,
        subscriptionPlanId: subscription.id,
      },
    }
  );
  if (!udatedPaymentDetail) {
    throw new ApiError(httpStatus['100_MESSAGE'], 'the payment data cannot be updated');
  }
  return udatedPaymentDetail;
};

/**
 * Get subscriptionPlan by id
 * @param {ObjectId} id
 * @returns {Promise<SubscriptionPlan>}
 */
const getPayments = async (id) => {
  return PaymentDetail.findById(id);
};

module.exports = {
  savePaymentDetails,
  getPayments,
  updatePaymentDetails,
};
