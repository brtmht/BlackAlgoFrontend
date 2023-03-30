const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const stripeAccountSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
        },
        customerId: {
            type: String,
            default: null
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        phoneNo: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        countryCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
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
stripeAccountSchema.plugin(toJSON);
stripeAccountSchema.plugin(paginate);

/**
 * @typedef StripeAccount
 */
const StripeAccount = mongoose.model('StripeAccount', stripeAccountSchema);

module.exports = StripeAccount;
