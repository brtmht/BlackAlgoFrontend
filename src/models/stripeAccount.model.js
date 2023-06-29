const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const stripeAccountSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    customerId: {
      type: String,
      default: null,
      unique: true,
    },
    email: {
      type: String,

      trim: true,
    },
    phoneNo: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    status: {
      type: Boolean,
      default: true,
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
stripeAccountSchema.plugin(toJSON);
stripeAccountSchema.plugin(paginate);

/**
 * @typedef StripeAccount
 */
const StripeAccount = mongoose.model('StripeAccount', stripeAccountSchema);

module.exports = StripeAccount;
