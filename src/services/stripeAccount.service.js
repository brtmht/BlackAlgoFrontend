/* eslint-disable no-unused-vars */
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { StripeAccount, PaymentDetail } = require('../models');
// eslint-disable-next-line import/order
const Stripe = require('stripe')(process.env.STRIPE_KEY);

const stripeEndPointSecret = process.env.END_POINT_SECRET;

const configStripe = async (req, res) => {
  const clientKey = await process.env.STRIPE_PUBLISHABLE_KEY;
  return clientKey;
};

const saveStripeAccount = async (StripeData, customerID, user) => {
  const data = await StripeAccount.create({
    userId: user,
    customerId: customerID,
    email: StripeData.email,
    phoneNo: StripeData.phone,
    country: StripeData.address,
  });
  return data;
};
const updateStripeAccount = async (id, customerCardId) => {
  const udatedPaymentDetails = await StripeAccount.updateOne(
    { _id: id },
    {
      $set: {
        customerCardId,
      },
    }
  );
};
const stripeWebhook = async (req, user) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = Stripe.webhooks.constructEvent(req.body, sig, stripeEndPointSecret);
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'stripe webhook error');
  }

  let paymentIntentData;
  // Handle the event
  switch (event.type) {
    case 'payment_intent.amount_capturable_updated':
      paymentIntentData = event.data.object;
      // Then define and call a function to handle the event payment_intent.amount_capturable_updated
      break;
    case 'payment_intent.canceled':
      paymentIntentData = event.data.object;
      await PaymentDetail.findOneAndUpdate(
        { _id: user },
        {
          $set: {
            paymentStatus: 'canceled',
          },
        }
      );
      break;
    case 'payment_intent.created':
      paymentIntentData = event.data.object;
      await PaymentDetail.findOneAndUpdate(
        { _id: user },
        {
          $set: {
            paymentStatus: 'pending',
          },
        }
      );
      break;
    case 'payment_intent.partially_funded':
      paymentIntentData = event.data.object;
      await PaymentDetail.findOneAndUpdate(
        { _id: user },
        {
          $set: {
            paymentStatus: 'incomplete',
          },
        }
      );
      break;
    case 'payment_intent.payment_failed':
      paymentIntentData = event.data.object;
      await PaymentDetail.findOneAndUpdate(
        { _id: user },
        {
          $set: {
            paymentStatus: 'failed',
          },
        }
      );
      break;
    case 'payment_intent.processing':
      paymentIntentData = event.data.object;
      await PaymentDetail.findOneAndUpdate(
        { _id: user },
        {
          $set: {
            paymentStatus: 'pending',
          },
        }
      );
      break;
    case 'payment_intent.succeeded':
      paymentIntentData = event.data.object;
      await PaymentDetail.findOneAndUpdate(
        { _id: user },
        {
          $set: {
            paymentStatus: 'completed',
          },
        }
      );
      break;
    // ... handle other event types
    default:
      throw new ApiError(httpStatus.BAD_REQUEST);
  }

  // Return a 200 response to acknowledge receipt of the event
};
/**
 * Create a subscriptionPlan
 * @param {Object} stripeAccountBody
 * @returns {String}
 */
const createNewCustomer = async (stripeAccountBody) => {
  const newCustomer = await Stripe.customers.create({
    email: stripeAccountBody.email,
    address: { country: stripeAccountBody.country },
    phone: stripeAccountBody.phone,
  });
  return newCustomer;
};

const createPaymentIntent = async (stripeAccountBody, id) => {
  const paymentIntent = await Stripe.paymentIntents.create({
    amount: stripeAccountBody.amount * 100,
    currency: 'usd',
    payment_method_types: ['card'],
    customer: id,
  });
  return paymentIntent;
};
const createStripePayment = async (stripeUserData, userId) => {
  let customerId;
  const customers = await Stripe.customers.list({
    email: stripeUserData.email,
  });
  if (customers.data.length === 0) {
    const newCustomer = await createNewCustomer(stripeUserData);
    if (newCustomer) {
      customerId = newCustomer.id;
    }
  } else {
    customerId = customers.data[0].id;
  }
  if (customerId) {
    // eslint-disable-next-line no-console
    const paymentIntent = await createPaymentIntent(stripeUserData, customerId);
    if (paymentIntent) {
      let stripeData = await StripeAccount.findOne({ customerId });
      stripeData = await saveStripeAccount(stripeUserData, customerId, userId);
      return { paymentIntent, stripeData };
    }
  }
};

module.exports = {
  createStripePayment,
  saveStripeAccount,
  stripeWebhook,
  configStripe,
  updateStripeAccount,
};
