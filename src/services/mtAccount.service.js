const httpStatus = require('http-status');
const { MtAccount } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a exchange
 * @param {Object} mtAccountBody
 * @returns {Promise<MtAccount>}
 */
const createMtAccountNew = async (mtAccountBody) => {
  return MtAccount.create(mtAccountBody);
};

/**
 * Query for exchanges
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryMTAccount = async (filter, options) => {
  const exchanges = await MtAccount.paginate(filter, options);
  return exchanges;
};

/**
 * Get exchange by id
 * @param {ObjectId} id
 * @returns {Promise<MtAccount>}
 */
const getMtAccountById = async (id) => {
  return MtAccount.findById(id);
};

/**
 * Get exchange by name
 * @param {string} name
 * @returns {Promise<MtAccount>}
 */
const getMtAccountByName = async (name) => {
  return MtAccount.findOne({ name });
};
/**
 * Update exchange by id
 * @param {ObjectId} mtAccountId
 * @param {Object} updateBody
 * @returns {Promise<MtAccount>}
 */
const updateMtAccountById = async (mtAccountId, updateBody) => {
  const mtAccount = await getMtAccountById(mtAccountId);

  if (!mtAccount) {
    throw new ApiError(httpStatus.NOT_FOUND, 'MtAccount not found');
  }
  const updateMtAccount = await MtAccount.findByIdAndUpdate(mtAccountId, {
    ...updateBody,
  });

  return updateMtAccount;
};

/**
 * Delete exchange by id
 * @param {ObjectId} mtAccountId
 * @returns {Promise<MtAccount>}
 */
const deleteMtAccountById = async (mtAccountId) => {
  const mtAccount = await getMtAccountById(mtAccountId);
  if (!mtAccount) {
    throw new ApiError(httpStatus.NOT_FOUND, 'MtAccount not found');
  }
  const mtAccountDeleted = await MtAccount.findByIdAndDelete(mtAccountId);
  return mtAccountDeleted;
};

module.exports = {
  createMtAccountNew,
  queryMTAccount,
  getMtAccountById,
  getMtAccountByName,
  updateMtAccountById,
  deleteMtAccountById,
};
