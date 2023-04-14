const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.CONFLICT, 'Email already taken');
  }
  const { name, email, password } = userBody;
  const newName = name.toLowerCase();
  // const newMail = email.toLowerCase()
  return User.create({
    name: newName,
    email,
    password,
  });
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */

const updateUserById = async (userId, updateData) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const { file } = updateData;
  if (file || Object.keys(updateData.body).length !== 0) {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          name: updateData.body.name ? updateData.body.name : user.name,
          image: file ? updateData.file.path : user.image,
        },
      }
    );
    return updatedUser;
  }
  throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Request data not found');
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const userDeleted = await User.findByIdAndUpdate(userId, { isDeleted: true });
  return userDeleted;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
