const httpStatus = require('http-status');
const { TransactionHistory, PaymentDetail } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a subscriptionPlan
 * @param {Object} transaction
 * @returns {Object}
 */
const saveTransactionHistory = async (paymentData, reqData) => {
  const PaymentDetails = await TransactionHistory.findOne({ paymentDetailId: paymentData._id });
  if (!PaymentDetails) {
    const history = await TransactionHistory.create({
      userId: reqData.user._id,
      paymentDetailId: paymentData._id,
      paymentStatus: reqData.body.paymentStatus,
      stripeTransactionId: reqData.body.stripeTransactionId,
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
const getLast24HrTransactionHistory = async (id) => {
  const history24Hr = await PaymentDetail.find({
    userId: id,
    createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  }).exec();
  if (history24Hr.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }
  return history24Hr;
};
const getLast1WeekTransactionHistory = async (id) => {
  const history24Hr = await PaymentDetail.find({
    userId: id,
    createdAt: { $gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  }).exec();
  return history24Hr;
};
const getLast30DaysTransactionHistory = async (id) => {
  const history24Hr = await PaymentDetail.find({
    userId: id,
    createdAt: { $gt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
  }).exec();
  return history24Hr;
};
module.exports = {
  saveTransactionHistory,
  getPaymentsById,
  getStripeTransactionHistory,
  getCryptoTransactionHistory,
  getLast24HrTransactionHistory,
  getLast1WeekTransactionHistory,
  getLast30DaysTransactionHistory,
};
