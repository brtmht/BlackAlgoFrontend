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
  ],
  admin: ['getUsers', 'manageUsers'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
