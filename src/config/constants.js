module.exports = {
  PAYMENT_STATUS: {
    INCOMLETE: 'incomplete',
    PENDING: 'pending',
    REFUNDED: 'refunded',
    FAILED: 'failed',
    SUCCEDED: 'succeded',
    CANCELLED: 'cancelled',
  },
  PAYMENT_TYPE: {
    CARD: 'card',
    CRYPTO: 'crypto',
  },
  VERIFY_EMAIL_OPTIONS: {
    subject: 'Please verify your blackalgo email',
    template_name: 'verifyEmail.ejs',
  },
  RESETPASSWORD_EMAIL_OPTIONS: {
    subject: 'Reset your Blackalgo password',
    template_name: 'resetPassword.ejs',
  },
  TRADING_ORDER_TYPE: {
    BINANCE: 'Binance',
    MT4: 'MT4',
  },
  CMD_TYPE: {
    BUY: 'Buy',
    SELL: 'Sell',
  },
};
