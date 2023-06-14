const allRoles = {
  user: [
    'updateUser',
    'getUser',
    'changePassword',
    'checkEmail',
    'generate2fa',
    'verify2Fa',
    'turnOn2Fa',
    'turnOff2Fa',
    'disabled2faBySecret',
    'generateNew',
    'getTransactionHistory',
    'activate2Fa',
    'getUserStrategies',
    'updateUserStrategy',
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
    'strategyWithoutAuth',
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
    'updateBroker',
    'updateMTAccount',
    'deleteAccount',
    'deleteBroker',
    'getMtBrokerById',
    'getMtAccountById',
    'ServerList',
    'FxblueScript',
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
    'ReadAllNotification',
    'getUserWallet',
    'createTradingOrder',
    'getTradingOrder',
    'tradingOrderWithPagination',
    'updateTradingOrder',
    'deleteTradingOrder',
    'clearUserToken',
    'createUserExchangeConfig',
    'getUserExchangeConfig',
    'getConfigData',
    'getTermAndPolicyData',
  ],
  manager: [
    'getUser',
    'getUsers',
    'updateUserEmail',
    'getAllUserStrategies',
    'createUsers',
    'allNotification',
    'blockUser',
    'getUserById',
    'deleteUsers',
    'monthlyUsers',
  ],

  admin: [
    'getUser',
    'getUsers',
    'updateUserEmail',
    'getAllUserStrategies',
    'createUsers',
    'allNotification',
    'blockUser',
    'getUserById',
    'deleteUsers',
    'monthlyUsers',
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
