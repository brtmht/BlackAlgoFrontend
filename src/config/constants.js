module.exports = {
  YEARLYPERCENTAGE:7,
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
    subject: 'Please verify your email',
    template_name: 'verifyEmail.ejs',
  },
  SUBSCRIPTION_EMAIL_OPTIONS: {
    subject: 'Details of user requesting subscription',
    template_name: 'userDetail.ejs',
  },
  RESETPASSWORD_EMAIL_OPTIONS: {
    subject: 'Reset your Blackalgo password',
    template_name: 'resetPassword.ejs',
  },
  SEND_BACKUP_2FA: {
    subject: 'Your Blackalgo 2FA Key',
    template_name: 'send2fa.ejs',
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
