const httpStatus = require('http-status');
const { SubscriptionPlan } = require('../models');
const ApiError = require('../utils/ApiError');
const Stripe_key="your_key_goes_here"
const Stripe =require('stripe');
/**
 * Create a subscriptionPlan
 * @param {Object} subscriptionPlanBody
 * @returns {}
 */


const createStripePayment = async (stripeAccountBody) => {
    const customer= await Stripe.customers.list({
        email:stripeAccountBody.email
    })
    if(!customer){
        const newCustomer = await Stripe.customers.create({
            email:stripeAccountBody.email,
            address:stripeAccountBody.country,
            phone:stripeAccountBody.phone
        })
        if(newCustomer){
            try {
                  const createCharge = await Stripe.charges.create({
                  receipt_email:stripeAccountBody.email,
                  ammount:stripeAccountBody.ammount*100,
                  currency:stripeAccountBody.currency,
                  payment_method:stripeAccountBody,method,
                  customer:newCustomer.id
                })
    
                return createCharge;
            } catch (error) {
                throw new Error(error)
            }
        }
    }
    else{
        try {
                const createCharge = await Stripe.charges.create({
                receipt_email:stripeAccountBody.email,
                ammount:stripeAccountBody.ammount*100,
                currency:stripeAccountBody.currency,
                payment_method:stripeAccountBody,method,
                customer:newCustomer.id
            })

              return createCharge;
            } catch (error) {
                throw new Error(error)
            }
    }
};




module.exports = {
    createStripePayment,
};
