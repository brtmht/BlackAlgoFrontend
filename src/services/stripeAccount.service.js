/* eslint-disable no-unused-vars */
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { StripeAccount, PaymentDetail } = require('../models');
// eslint-disable-next-line import/order
const Stripe = require('stripe')(process.env.STRIPE_KEY);

const endpointSecret = 'whsec_5cd19db1106287cab6dd4a3b2aa86d364ffa986b002c436046ce4f453af1cc8e';

const stripeWebhook = async (req, user) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = Stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
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
      console.log('created');
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
    currency: stripeAccountBody.currency,
    payment_method_types: ['card'],
    customer: id,
  });
  return paymentIntent;
};
const createStripePayment = async (stripeUserData) => {
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
    try {
      const paymentIntent = await createPaymentIntent(stripeUserData, customerId);
      return paymentIntent;
    } catch (error) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'transaction failed while creating charge with existing customer');
    }
  }
};
// user_id stripe customer id , email, phone number , country save in stripe account

const saveStripeAccount = async (paymentIntentData, userData, user) => {
  const data = await StripeAccount.create({
    userId: user,
    customerId: paymentIntentData.customer,
    email: userData.email,
    phoneNo: userData.phone,
    countryCode: userData.address,
  });
  return data;
};
module.exports = {
  createStripePayment,
  saveStripeAccount,
  stripeWebhook,
};
