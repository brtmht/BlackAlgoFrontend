const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const exchangeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
exchangeSchema.plugin(toJSON);
exchangeSchema.plugin(paginate);

/**
 * Check if name is taken
 * @param {string} name - The exchange's name
 * @param {ObjectId} [excludeExchangeId] - The id of the exchange to be excluded
 * @returns {Promise<boolean>}
 */
exchangeSchema.statics.isNameTaken = async function (name, excludeExchangeId) {
  const exchange = await this.findOne({ name, _id: { $ne: excludeExchangeId } });
  return !!exchange;
};

/**
 * @typedef Exchange
 */
const Exchange = mongoose.model('Exchange', exchangeSchema);

module.exports = Exchange;
