const httpStatus = require('http-status');
const Binance = require('node-binance-api');
const { CryptoAccount } = require('../models');
const ApiError = require('../utils/ApiError');
/**
 * Create a subscriptionPlan
 * @param {Object} subscriptionPlanBody
 * @returns {Promise<CryptoAccount>}
 */
const createCryptoAccount = async (cryptoAccountBody) => {
  if (await CryptoAccount.isNameTaken(cryptoAccountBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken');
  }
  return CryptoAccount.create(cryptoAccountBody);
};
const getBinance = async () => {};

const createBinanceLogIn = async () => {
  const binance = new Binance().options({
    APIKEY: process.env.API_BINANCE_KEY,
    APISECRET: process.env.BINANCE_SECRET,
  });
  return binance;
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
  return CryptoAccount.findById(id);
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
 * @param {ObjectId} cryptoId
 * @param {Object} updateBody
 * @returns {Promise<SubscriptionPlan>}
 */
const updateCryptoAccountById = async (cryptoId, updateBody) => {
  const crypto = await getCryptoAccountById(cryptoId);
  if (!crypto) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Crypto not found');
  }
  const updateCrypto = await CryptoAccount.findByIdAndUpdate(cryptoId, {
    ...updateBody,
  });

  return updateCrypto;
};

/**
 * Delete exchange by id
 * @param {ObjectId} cryptoId
 * @returns {Promise<Exchange>}
 */

const deleteCryptoAccountById = async (cryptoId) => {
  const crypto = await getCryptoAccountById(cryptoId);
  if (!crypto) {
    throw new ApiError(httpStatus.NOT_FOUND, 'crypto not found');
  }
  const cryptoDeleted = await CryptoAccount.findByIdAndUpdate(cryptoId, { isDeleted: true });
  return cryptoDeleted;
};

module.exports = {
  getBinance,
  createBinanceLogIn,
  createCryptoAccount,
  queryCryptoAccount,
  getCryptoAccountById,
  getCryptoAccountByName,
  updateCryptoAccountById,
  deleteCryptoAccountById,
};
