const httpStatus = require('http-status');
const { SubscriptionPlan } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a subscriptionPlan
 * @param {Object} subscriptionPlanBody
 * @returns {Promise<SubscriptionPlan>}
 */
const createSubscriptionPlan = async (subscriptionPlanBody) => {
  if (await SubscriptionPlan.isNameTaken(subscriptionPlanBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken');
  }
  return SubscriptionPlan.create(subscriptionPlanBody);
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
const querySubscriptionPlans = async (filter, options) => {
  const subscriptionPlans = await SubscriptionPlan.paginate(filter, options);
  return subscriptionPlans;
};

/**
 * Get subscriptionPlan by id
 * @param {ObjectId} id
 * @returns {Promise<SubscriptionPlan>}
 */
const getSubscriptionPlanById = async (id) => {
  return SubscriptionPlan.findById(id);
};

/**
 * Get subscriptionPlan by name
 * @param {string} name
 * @returns {Promise<SubscriptionPlan>}
 */
const getSubscriptionPlanByName = async (name) => {
  return SubscriptionPlan.findOne({ name });
};

/**
 * Update subscriptionPlan by id
 * @param {ObjectId} subscriptionPlanId
 * @param {Object} updateBody
 * @returns {Promise<SubscriptionPlan>}
 */
const updateSubscriptionPlanById = async (subscriptionPlanId, updateBody) => {
  const subscriptionPlan = await getSubscriptionPlanById(subscriptionPlanId);
  if (!subscriptionPlan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubscriptionPlan not found');
  }
  if (updateBody.name && (await SubscriptionPlan.isNameTaken(updateBody.name, subscriptionPlanId))) {
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
const deleteSubscriptionPlanById = async (subscriptionPlanId) => {
  const subscriptionPlan = await getSubscriptionPlanById(subscriptionPlanId);
  if (!subscriptionPlan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubscriptionPlan not found');
  }
  await subscriptionPlan.remove();
  return subscriptionPlan;
};

module.exports = {
  createSubscriptionPlan,
  querySubscriptionPlans,
  getSubscriptionPlanById,
  getSubscriptionPlanByName,
  updateSubscriptionPlanById,
  deleteSubscriptionPlanById,
};
