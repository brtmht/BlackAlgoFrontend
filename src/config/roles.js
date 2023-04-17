const allRoles = {
  user: [
    'getExchanges',
    'makePayments',
    'manageExchanges',
    'manageRegions',
    'getRegions',
    'getPayments',
    'manageStrategies',
    'getUserStrategies',
    'manageUserStrategies',
    'getStrategies',
    'manageSubscriptionPlans',
    'getSubscriptionPlans',
    'getStripeSubscriptions',
    'postPayment',
    'postSubscriptionPlans',
    'webhookResponse',
    'manageUsers',
    'getUsers',
    'updateUser',
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
  ],
  admin: ['getUsers', 'manageUsers'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
