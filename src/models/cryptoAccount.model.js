const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const cryptoAccountSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        exchangeName: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        cryptoAddress: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        amount: {
            type: Number,
            default: 0,
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
