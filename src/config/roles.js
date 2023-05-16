const allRoles = {
  user: [
    'updateUser',
    'getUser',
    'changePassword',
    'generate2fa',
    'verify2Fa',
    'turnOn2Fa',
    'turnOff2Fa',
    'generateNew',
    'getTransactionHistory',
    'activate2Fa',
    'getUserStrategies',
    'manageUserStrategies',
    'updateOnBoarding',
    'getBackUpSecretKey',
    'getExchanges',
    'manageExchanges',
    'manageRegions',
    'getRegions',
    'getPayments',
    'manageStrategies',
    'getStrategies',
    'deleteSubscriptionPlans',
    'updateSubscriptionPlans',
    'getSubscriptionPlans',
    'postSubscriptionPlans',
    'getStripeSubscriptions',
    'postPayment',
    'makePayments',
    'stripePayment',
    'createPayment',
    'webhookResponse',
    'getMtAccount',
    'postMtAccount',
    'getMtBroker',
    'postMtBroker',
    'updateMTBroker',
    'updateMTAccount',
    'deleteMTAccount',
    'deleteMTBroker',
    'getMtBrokerById',
    'getMtAccountById',
    'firebaseToken',
    'history',
    'getUserStrategiesByUserID',
    'createSupport',
    'getSupport',
    'getAllSupport',
    'deleteSupport',
    'patchSupport',
    'getunreadNotification',
    'getNotificationById',
    'patchNotificationById',
    'deleteNotificationById',
    'getUserWallet',
    'createTradingOrder',
    'getTradingOrder',
    'updateTradingOrder',
    'deleteTradingOrder',
    'clearToken',
  ],

  admin: ['getUsers', 'getAllUserStrategies', 'createUsers', 'allNotification', 'blockUser'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
