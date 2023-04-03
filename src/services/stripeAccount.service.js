const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const Stripe = require('stripe')(process.env.STRIPE_KEY);
/**
 * Create a subscriptionPlan
 * @param {Object} stripeAccountBody
 * @returns {String}
 */
const createNewCustomer = async (stripeAccountBody) => {
  const newCustomer = await Stripe.customers.create({
    email: stripeAccountBody.email,
    address: stripeAccountBody.country,
    phone: stripeAccountBody.phone,
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
const createStripePayment = async (stripeAccountBody) => {
  const { email } = stripeAccountBody;
  let customerId;
  const customers = await Stripe.customers.list({
    email: email,
  });
  if (customers.data.length == 0) {
    const newCustomer = await createNewCustomer(stripeAccountBody);
    if (newCustomer) {
      console.log("new customer")
      customerId = newCustomer.id;
    } else {
      console.log("old customer")
      customerId = customers.data[0].id;
    }
  }
  else{
    customerId = customers.data[0].id;
  }
  if (customerId) {
    try {
      const paymentIntent = await createPaymentIntent(stripeAccountBody, customerId);
      console.log(paymentIntent)
      return paymentIntent;
    } catch (error) {
      throw new ApiError(httpStatus.BAD_REQUEST, error, 'transaction failed while creating charge with existing customer');
    }
  }
};
module.exports = {
  createStripePayment,
};
