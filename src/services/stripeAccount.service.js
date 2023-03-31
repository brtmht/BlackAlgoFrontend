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
//   console.log('newCustomer', newCustomer);
  return newCustomer;
};
const createPaymentIntent = async (stripeAccountBody, id) => {
  const paymentIntent = await Stripe.paymentIntents.create({
    receipt_email: stripeAccountBody.email,
    ammount: stripeAccountBody.ammount * 100,
    currency: stripeAccountBody.currency,
    payment_method: 'card',
    customer: id,
  });
  return paymentIntent;
};
const createStripePayment = async (stripeAccountBody) => {
    const { email } = stripeAccountBody;
    const customers = await Stripe.customers.list({
        email:email
      });
      console.log("existing customer",customers)
      if(!customers){
          const newCustomer = createNewCustomer(stripeAccountBody);
          if (newCustomer) {
            try {
              const paymentIntent = await createPaymentIntent(stripeAccountBody, newCustomer.id);
              return paymentIntent;
            } catch (error) {
              throw new ApiError(httpStatus.BAD_REQUEST, 'transaction failed while creating with new customer');
            }
          } 
         }
        else {
            try {
            const paymentIntent = await createPaymentIntent(stripeAccountBody, customers[0].id);
            return paymentIntent;
            } catch (error) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'transaction failed while creating charge with existing customer');
            }
        }
};

module.exports = {
  createStripePayment,
};
