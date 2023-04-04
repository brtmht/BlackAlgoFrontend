const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { StripeAccount } = require('../models');
// eslint-disable-next-line import/order
const Stripe = require('stripe')(process.env.STRIPE_KEY);
/**
 * Create a subscriptionPlan
 * @param {Object} stripeAccountBody
 * @returns {String}
 */
const createNewCustomer = async (stripeAccountBody) => {
  const paymentMethod = await Stripe.paymentMethods.create({
    type: 'card',
    card: {
      number: '4242424242424242',
      exp_month: 7,
      exp_year: 2027,
      cvc: '314',
    },
  });

  const newCustomer = await Stripe.customers.create({
    email: stripeAccountBody.email,
    address: { country: stripeAccountBody.country },
    phone: stripeAccountBody.phone,
    payment_method: paymentMethod.id,
  });
  return newCustomer;
};

const createPaymentIntent = async (stripeAccountBody, id) => {
  const paymentIntent = await Stripe.paymentIntents.create({
    receipt_email: stripeAccountBody.email,
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
    } else {
      customerId = customers.data[0].id;
    }
  } else {
    customerId = customers.data[0].id;
  }
  if (customerId) {
    try {
      const paymentIntent = await createPaymentIntent(stripeUserData, customerId);
      return paymentIntent;
    } catch (error) {
      throw new ApiError(httpStatus.BAD_REQUEST, error, 'transaction failed while creating charge with existing customer');
    }
  }
};
// user_id stripe customer id , email, phone number , country save in stripe account

const saveStripeAccount = async (saveBody, userData, user) => {
  const data = await StripeAccount.create({
    userId: user,
    customerId: saveBody.customer,
    email: userData.email,
    phoneNo: userData.phone,
    countryCode: userData.address,
  });
  return data;
};
module.exports = {
  createStripePayment,
  saveStripeAccount,
};
