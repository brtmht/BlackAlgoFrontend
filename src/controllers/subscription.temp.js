/* eslint-disable prettier/prettier */
// /* eslint-disable prettier/prettier */
// const httpStatus = require('http-status');
// const ApiError = require('../utils/ApiError');
// const catchAsync = require('../utils/catchAsync');
// const  subscriptionPlanService  = require('../services/subscriptionPlan.service');
// // eslint-disable-next-line prettier/prettier

// const createSubscription = catchAsync(async (req, res) => {
//   // eslint-disable-next-line prettier/prettier, no-console
//   console.log('Api Hit');
//   const subscriptionPlan = await subscriptionPlanService.createSubscriptionPlan(req.body)
//   if (!subscriptionPlan) {
//     // eslint-disable-next-line prettier/prettier
//     throw new ApiError(httpStatus.NOT_FOUND, 'subscriptionPlan not found');
//   }
//   res.status(httpStatus.CREATED).send(subscriptionPlan);
// });

// module.exports = {
//   createSubscription,
// };
