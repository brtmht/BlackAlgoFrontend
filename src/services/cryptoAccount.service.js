/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable no-undef */
const httpStatus = require('http-status');
const express = require('express')
const { CryptoAccount } = require('../models');
const ApiError = require('../utils/ApiError');

const app = express();
/**
 * Create a subscriptionPlan
 * @param {Object} subscriptionPlanBody
 * @returns {Promise<CryptoAccount>}
 */
const createCryptoAccount = async (cryptoAccountBody) => {
  if (await CryptoAccount.isNameTaken(cryptoAccountBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken');
  }
  return CryptoAccount.create(subscriptionPlanBody);
};
const getBinance = async () => {
  await app.get(
    'https://accounts.binance.com/en/oauth/authorize?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&state=CSRF_TOKEN&scope=SCOPES',
    function (req, res) {
      console.log(res, 'response');
      return res;
    }
  );
};

/**
 * Query for subscriptionPlans
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCryptoAccount = async (filter, options) => {
  const subscriptionPlans = await CryptoAccount.paginate(filter, options);
  return subscriptionPlans;
};

/**
 * Get subscriptionPlan by id
 * @param {ObjectId} id
 * @returns {Promise<SubscriptionPlan>}
 */
const getCryptoAccountById = async (id) => {
  return SubscriptionPlan.findById(id);
};

/**
 * Get subscriptionPlan by name
 * @param {string} name
 * @returns {Promise<SubscriptionPlan>}
 */
const getCryptoAccountByName = async (name) => {
  return CryptoAccount.findOne({ name });
};

/**
 * Update subscriptionPlan by id
 * @param {ObjectId} subscriptionPlanId
 * @param {Object} updateBody
 * @returns {Promise<SubscriptionPlan>}
 */
const updateCryptoAccountById = async (crypoId, updateBody) => {
  const subscriptionPlan = await getSubscriptionPlanById(cryptoId);
  if (!subscriptionPlan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubscriptionPlan not found');
  }
  if (updateBody.name && (await CryptoAccot.isNameTaken(updateBody.name, cryptoId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken');
  }
  Object.assign(subscriptionPlan, updateBody);
  await subscriptionPlan.save();
  return subscriptionPlan;
};
const deleteCryptoAccountById = async (cryptoId) => {
  const cryptoAcccount = await getSubscriptionPlanById(cryptoId);
  if (!subscriptionPlan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubscriptionPlan not found');
  }
  await cryptoAcccount.remove();
  return cryptoAcccount;
};

module.exports = {
  getBinance,
  createCryptoAccount,
  queryCryptoAccount,
  getCryptoAccountById,
  getCryptoAccountByName,
  updateCryptoAccountById,
  deleteCryptoAccountById,
};
