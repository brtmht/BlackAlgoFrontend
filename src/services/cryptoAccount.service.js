const httpStatus = require('http-status');
const Binance = require('node-binance-api');
const { CryptoAccount } = require('../models');
const ApiError = require('../utils/ApiError');
const { getPaymentsByMerchantTrade } = require('../services/transactionHistory.service');

const saveBinancePayment = async (paymentData) => {
  const payData = JSON.parse(paymentData.data);
  console.log(payData,"-----------------payData");
  const TransactionDetails = await getPaymentsByMerchantTrade(payData.merchantTradeNo);
  if (TransactionDetails) {
    console.log(TransactionDetails,"------------------TransactionDetails");
    const cryptoDetails = await CryptoAccount.findOne({ merchantAccountNo: payData.merchantTradeNo });
    console.log(cryptoDetails,"-----------------cryptoDetails");
    if (!cryptoDetails) {
      console.log({
        userId: TransactionDetails.userId,
        period: payData.productName,
        paymentMethod: payData.paymentInfo.payMethod,
        merchantAccountNo: payData.merchantTradeNo,
      });
      const history = await CryptoAccount.create({
        userId: TransactionDetails.userId,
        period: payData.productName,
        paymentMethod: payData.paymentInfo.payMethod,
        merchantAccountNo: payData.merchantTradeNo,
      });
      console.log(history,"-----------------history");
      if (!history) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'There is no transactions in history');
      }
      return history;
    }
    const cryptoHistory = await CryptoAccount.updateOne(
      { merchantAccountNo: payData.merchantTradeNo },
      {
        $set: {
          period: payData.productName,
          paymentMethod: payData.paymentInfo.payMethod,
        },
      }
    );
    console.log(cryptoHistory,"-----------------cryptoHistorycryptoHistory");
    return cryptoHistory;
  }
};

const saveBinanceContract = async (paymentData) => {
  const payData = JSON.parse(paymentData.data);
  const TransactionDetails = await getPaymentsByMerchantTrade(payData.merchantAccountNo);
  if (TransactionDetails) {
    const cryptoDetails = await CryptoAccount.findOne({ merchantAccountNo: payData.paymentData });
    if (!cryptoDetails) {
      const history = await CryptoAccount.create({
        userId: TransactionDetails.userId,
        merchantContractCode: payData.merchantContractCode,
        contractId: payData.contractId,
        openUserId: payData.openUserId,
        merchantAccountNo: payData.merchantAccountNo,
        singleUpperLimit: payData.singleUpperLimit,
        bizId: paymentData.bizId,
        bizStatus: paymentData.bizStatus,
      });
      if (!history) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'There is no contract in history');
      }
      return history;
    }
    const cryptoHistory = await CryptoAccount.updateOne(
      { merchantAccountNo: payData.merchantAccountNo },
      {
        $set: {
          merchantContractCode: payData.merchantContractCode,
          contractId: payData.contractId,
          openUserId: payData.openUserId,
          merchantAccountNo: payData.merchantAccountNo,
          singleUpperLimit: payData.singleUpperLimit,
          bizId: paymentData.bizId,
          bizStatus: paymentData.bizStatus,
        },
      }
    );
    return cryptoHistory;
  }
};


const UpdatedTerminatedContract = async (paymentData) => {
  const payData = JSON.parse(paymentData.data);
    const cryptoDetails = await CryptoAccount.findOne({ merchantAccountNo: payData.paymentData });
    if (cryptoDetails) {
      const cryptoHistory = await CryptoAccount.updateOne(
        { merchantAccountNo: payData.merchantAccountNo },
        {
          $set: {
            bizStatus: paymentData.bizStatus,
          },
        }
      );
      return cryptoHistory;
    }
    if (!cryptoDetails) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'There is no contract in history');
    }
};


module.exports = {
  saveBinancePayment,
  saveBinanceContract,
  UpdatedTerminatedContract,
};
