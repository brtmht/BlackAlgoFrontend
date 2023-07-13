const httpStatus = require('http-status');
const { PaymentDetail } = require('../models');
const { SubscriptionPlan } = require('../models');
const { StripeAccount } = require('../models');
const ApiError = require('../utils/ApiError');
const { userStrategyService } = require('../services');
// eslint-disable-next-line import/order
const Stripe = require('stripe')(process.env.STRIPE_KEY);
const { updateStripeSubscription } = require('./userExchangeConfig.service')

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


const saveBinacePaymentDetails = async (userId,paymentData,reqData) => {
  if(paymentData.status === 'SUCCESS'){
    const paymentCreated = await PaymentDetail.create({
      userId: userId,
      amount: reqData.orderAmount,
      portfolioAmount: reqData?.portfolioAmount? reqData?.portfolioAmount:'',
      paymentToken: paymentData.data.prepayId,
      paymentStatus: paymentData.status === 'SUCCESS' ? "success":"incomplete",
    });
  
    if (!paymentCreated) {
      throw new ApiError(httpStatus['201_MESSAGE'], 'transaction failed at details');
    }
    return paymentCreated;
  }
  throw new ApiError(httpStatus['400_MESSAGE'], 'Something went wrong');
  
};

// To update payment details after a transaction is processed
// const updatePaymentDetails = async (reqData) => {
//   let userId;
//   let subscription;
//   if (reqData.subscriptionPlanId) {
//     const paymentDetails = await PaymentDetail.findOne({ paymentToken: reqData.paymentToken });
//     const customerData = await StripeAccount.findById(paymentDetails.stripeAccountId);
//     const planId = await SubscriptionPlan.findOne({ _id: reqData.subscriptionPlanId });
//     if (planId.name === 'Monthly') {
//       // create subscription
//       subscription = await Stripe.subscriptions.create({
//         customer: customerData.customerId,
//         items: [{ price: planId.subscriptionPlanId }],
//         default_payment_method: reqData.paymentMethod,
//       });
//     }
//     userId = paymentDetails.userId;
//     // if (planId.name === 'Yearly') {
//     //   const product = await Stripe.products.create({ name: 'Yearly' });
//     //   const price = await Stripe.prices.create({
//     //     unit_amount: paymentDetails.amount * 100,
//     //     currency: 'usd',
//     //     recurring: { interval: 'year' },
//     //     product: product.id,
//     //   });

//     //   subscription = await Stripe.subscriptions.create({
//     //     customer: customerData.customerId,
//     //     items: [{ price: price.id }],
//     //     default_payment_method: reqData.paymentMethod,
//     //   });
//     // }
//   }
//   const udatedPaymentDetail = await PaymentDetail.updateOne(
//     { paymentToken: reqData.paymentToken },
//     {
//       $set: {
//         ...reqData,
//         subscriptionPlanId: subscription.id,
//       },
//     }
//   );
//   console.log(udatedPaymentDetail,"---------------------");
//   const userData = await userStrategyService.getUserStrategyByUser(userId);
//   if(userData){
//     console.log("------------",userData);
//     await userExchangeConfig.updateSubscription(userData);
//   }

  
//   if (!udatedPaymentDetail) {
//     throw new ApiError(httpStatus['100_MESSAGE'], 'the payment data cannot be updated');
//   }
//   return udatedPaymentDetail;
// };

const updatePaymentDetails = async (reqData) => {
  let userId;
  let subscription;

  if (reqData.subscriptionPlanId) {
    const paymentDetails = await PaymentDetail.findOne({ paymentToken: reqData.paymentToken });
    const customerData = await StripeAccount.findById(paymentDetails.stripeAccountId);
    const planId = await SubscriptionPlan.findOne({ _id: reqData.subscriptionPlanId });

    if (planId.name === 'Monthly') {
      // Create subscription
      subscription = await Stripe.subscriptions.create({
        customer: customerData.customerId,
        items: [{ price: planId.subscriptionPlanId }],
        default_payment_method: reqData.paymentMethod,
      });
    }

    userId = paymentDetails.userId;

    // if (planId.name === 'Yearly') {
    //   const product = await Stripe.products.create({ name: 'Yearly' });
    //   const price = await Stripe.prices.create({
    //     unit_amount: paymentDetails.amount * 100,
    //     currency: 'usd',
    //     recurring: { interval: 'year' },
    //     product: product.id,
    //   });

    //   subscription = await Stripe.subscriptions.create({
    //     customer: customerData.customerId,
    //     items: [{ price: price.id }],
    //     default_payment_method: reqData.paymentMethod,
    //   });
    // }
  }

  const updatedPaymentDetail = await PaymentDetail.updateOne(
    { paymentToken: reqData.paymentToken },
    {
      $set: {
        ...reqData,
        subscriptionPlanId: subscription ? subscription.id : null,
      },
    }
  );

  const userData = await userStrategyService.getUserStrategyByUser(userId);

  if (userData) {
    await updateStripeSubscription(userData);
  }

  if (updatedPaymentDetail.nModified === 0) {
    throw new ApiError(httpStatus['100_MESSAGE'], 'The payment data cannot be updated');
  }

  return updatedPaymentDetail;
};

const getPayments = async (id) => {
  return PaymentDetail.findById(id);
};

const getPaymentByToken = async (token) => {
  return PaymentDetail.findOne({paymentToken:token});
};


const getPaymentDataByUserId = async (id) => {
  return PaymentDetail.findOne({userId:id});
};


const updateBinancePaymentDetails = async (paymentData) => {
  const PaymentDetails = await getPaymentByToken (paymentData.bizIdStr);
  if(PaymentDetails){

    const updatedPaymentDetail = await PaymentDetail.updateOne(
      { paymentToken: paymentData.bizIdStr },
      {
        $set: {
          paymentStatus: "cancelled",
        },
      }
    );
    return updatedPaymentDetail;
  }

};


module.exports = {
  savePaymentDetails,
  getPayments,
  updatePaymentDetails,
  getPaymentDataByUserId,
  saveBinacePaymentDetails,
  getPaymentByToken,
  updateBinancePaymentDetails,
};
