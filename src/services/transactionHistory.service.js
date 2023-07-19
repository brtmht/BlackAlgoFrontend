const httpStatus = require('http-status');
const { TransactionHistory, PaymentDetail } = require('../models');
const { getPaymentByToken } = require('./paymentDetail.service');
const { getUserStrategyByUser, createUserStrategy } = require('./userStrategy.service');
const ApiError = require('../utils/ApiError');

/**
 * Create a subscriptionPlan
 * @param {Object} transaction
 * @returns {Object}
 */
const saveTransactionHistory = async (paymentData, reqData) => {
  const TransactionDetails = await TransactionHistory.findOne({ paymentDetailId: paymentData._id });
  if (!TransactionDetails) {
    const history = await TransactionHistory.create({
      userId: reqData.user._id,
      paymentDetailId: paymentData._id,
      paymentStatus: reqData.body.paymentStatus,
      transactionId: reqData.body.transactionId,
    });
    if (!history) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'There is no transactions in history');
    }
    return history;
  }
  const transactionHistory = await TransactionHistory.updateOne(
    { paymentDetailId: paymentData._id },
    {
      $set: {
        ...reqData.body,
      },
    }
  );
  return transactionHistory;
};

const saveBinanceTransactionHistory = async (paymentData) => {
  const PaymentDetails = await getPaymentByToken(paymentData.bizIdStr);
  const payData = JSON.parse(paymentData.data);
  if (PaymentDetails) {
    const TransactionDetails = await TransactionHistory.findOne({ paymentDetailId: PaymentDetails.id });
    if (!TransactionDetails) {
      const history = await TransactionHistory.create({
        userId: PaymentDetails.userId,
        paymentDetailId: PaymentDetails.id,
        paymentStatus: paymentData.bizStatus === 'PAY_SUCCESS' ? 'success' : 'incomplete',
        transactionId: payData.transactionId,
        payerId: payData.paymentInfo.payerId,
        merchantTradeNo: payData.merchantTradeNo,
      });

      const userData = await getUserStrategyByUser(PaymentDetails.userId);

      if (userData) {
        await createUserStrategy(
          { paymentDetailId: payData.transactionId, step: 'payment' },
          PaymentDetails.userId
        );
      }
      if (!history) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'There is no transactions in history');
      }
      return history;
    }
    const transactionHistory = await TransactionHistory.updateOne(
      { paymentDetailId: PaymentDetails._id },
      {
        $set: {
          paymentDetailId: PaymentDetails.id,
          paymentStatus: paymentData.bizStatus === 'PAY_SUCCESS' ? 'success' : 'incomplete',
          transactionId: paymentData.data.transactionId,
        },
      }
    );
    return transactionHistory;
  }
  throw new ApiError(httpStatus.BAD_REQUEST, 'payment detail not found');
};
const getPaymentsById = async (id) => {
  const paymentHistory = await TransactionHistory.find({ userId: id });
  if (!paymentHistory) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'There is no transactions in history');
  }
  return paymentHistory;
};
const getStripeTransactionHistory = async () => {
  const stripeHistory = await PaymentDetail.find({ cryptoId: null });
  if (!stripeHistory) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'There is no transactions in history');
  }
  return stripeHistory;
};
const getCryptoTransactionHistory = async () => {
  const cryptoHistory = await PaymentDetail.find({ stripeAccountId: null });
  if (!cryptoHistory) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }
  return cryptoHistory;
};

module.exports = {
  saveTransactionHistory,
  getPaymentsById,
  getStripeTransactionHistory,
  getCryptoTransactionHistory,
  saveBinanceTransactionHistory,
};
