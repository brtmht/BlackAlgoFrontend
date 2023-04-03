const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { paymentDetailService,stripeAccountService,transactionHistoryService } = require('../services');

const createPayment = catchAsync(async (req, res) => {
    if(req.body.paymentType==='card'){
        const paymentIntent = await stripeAccountService.createStripePayment(req.body)
        // const makePayment= await paymentDetailService.createPaymentService(payment)
        res.send(paymentIntent);
    }
    if(req.body.paymentType==="crypto"){
         throw new ApiError(httpStatus.NOT_FOUND,"This mode is not ready yet")
    }
})
const getPayment = catchAsync(async (req, res) => {
  const payments = await paymentDetailService.getPayments(req.params.paymentDetailId);
  if (!payments) {
    throw new ApiError(httpStatus.NOT_FOUND, 'subscriptionPlan not found');
  } 
  res.send(payments);
});

const getPaymentHistory = catchAsync (async(req,res)=>{
    const history= await transactionHistoryService.getPaymnetsById(req.params.userId);
    if (!history) {
        throw new ApiError(httpStatus.NOT_FOUND, 'no history found');
      }
      return history;
})

module.exports = {
    createPayment,
    getPayment,
    getPaymentHistory,
   
};
