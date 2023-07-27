const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const cryptoAccountSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    contractId: {
      type: Number,
    },
    merchantContractCode: {
      type: String,
    },
    openUserId: {
      type: String,
    },
    merchantAccountNo: {
      type: String,
    },
    singleUpperLimit: {
      type: Number,
    },
    bizId: {
      type: Number,
    },
    bizStatus: {
      type: String,
    },
    paymentMethod: {
      type: String,
    },
    period: {
      type: String,
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