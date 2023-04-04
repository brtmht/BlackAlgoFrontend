const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const cryptoAccountSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,

      trim: true,
    },
    exchangeName: {
      type: String,

      unique: true,
      trim: true,
    },
    cryptoAddress: {
      type: String,

      unique: true,
      trim: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
cryptoAccountSchema.plugin(toJSON);
cryptoAccountSchema.plugin(paginate);

/**
 * @typedef CryptoAccount
 */
const CryptoAccount = mongoose.model('CryptoAccount', cryptoAccountSchema);

module.exports = CryptoAccount;
