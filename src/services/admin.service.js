const { User } = require('../models');

/**
 * Create a exchange
 * @param {Object} userBody
 * @returns {Promise<Exchange>}
 */
const updateUser = async (userBody, id) => {
  return User.findByIdAndUpdate(id, {
    ...userBody,
  });
};

module.exports = {
  updateUser,
};
