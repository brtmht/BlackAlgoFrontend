const { User } = require('../models');

/**
 * Create a exchange
 * @param {Object} userBody
 * @returns {Promise<Exchange>}
 */
const updateUser = async (userBody, id) => {
  if (await User.isEmailTaken(userBody.email)) {
    const updatedUser = await User.findOneAndUpdate(
      { email: userBody.email },
      {
        $set: {
          name: userBody.name,
          isDeleted: userBody.isDeleted,
          isBlocked: userBody.isBlocked,
        },
      }
    );
    return updatedUser;
  }
  return User.findByIdAndUpdate(id, {
    ...userBody,
  });
};
module.exports = {
  updateUser,
};
