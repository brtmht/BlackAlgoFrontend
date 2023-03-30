const httpStatus = require('http-status');
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
  return CryptoAccount.create(subscriptionPlanBody);
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
const getCryptoAccountById= async (id) => {
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
const updateCryptoAccountById= async (cryptoId, updateBody) => {
  const subscriptionPlan = await getSubscriptionPlanById(cryptoId);
  if (!subscriptionPlan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubscriptionPlan not found');
  }
  if (updateBody.name && (await CryptoAccount.isNameTaken(updateBody.name, cryptoId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken');
  }
  Object.assign(subscriptionPlan, updateBody);
  await subscriptionPlan.save();
  return subscriptionPlan;
};

/**
 * Delete subscriptionPlan by id
 * @param {ObjectId} subscriptionPlanId
 * @returns {Promise<SubscriptionPlan>}
 */
const deleteCryptoAccountById = async (cryptoId) => {
  const cryptoAcccount = await getSubscriptionPlanById(cryptoId);
  if (!subscriptionPlan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubscriptionPlan not found');
  }
  await cryptoAcccount.remove();
  return cryptoAcccount;
};

module.exports = {
    createCryptoAccount,
    queryCryptoAccount,
    getCryptoAccountById,
    getCryptoAccountByName,
    updateCryptoAccountById,
    deleteCryptoAccountById,
};
