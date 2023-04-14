const httpStatus = require('http-status');
const { Region } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a region
 * @param {Object} regionBody
 * @returns {Promise<Region>}
 */
const createRegion = async (regionBody) => {
  if (await Region.isNameTaken(regionBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken');
  }
  return Region.create(regionBody);
};

/**
 * Query for regions
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryRegions = async (filter, options) => {
  const regions = await Region.paginate(filter, options);
  return regions;
};

/**
 * Get region by id
 * @param {ObjectId} id
 * @returns {Promise<Region>}
 */
const getRegionById = async (id) => {
  return Region.findById(id);
};

/**
 * Get region by name
 * @param {string} name
 * @returns {Promise<Region>}
 */
const getRegionByName = async (name) => {
  return Region.findOne({ name });
};

/**
 * Update region by id
 * @param {ObjectId} regionId
 * @param {Object} updateBody
 * @returns {Promise<Region>}
 */
const updateRegionById = async (regionId, updateBody) => {
  const region = await getRegionById(regionId);
  if (!region) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Region not found');
  }
  const updateRegion = await Region.findByIdAndUpdate(regionId, {
    ...updateBody,
  });

  return updateRegion;
};

/**
 * Delete region by id
 * @param {ObjectId} regionId
 * @returns {Promise<Region>}
 */
const deleteRegionById = async (regionId) => {
  const region = await getRegionById(regionId);
  if (!region) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Region not found');
  }
  const regionDeleted = await Region.findByIdAndUpdate(regionId, { isDeleted: true });
  return regionDeleted;
};

module.exports = {
  createRegion,
  queryRegions,
  getRegionById,
  getRegionByName,
  updateRegionById,
  deleteRegionById,
};
