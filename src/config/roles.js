const allRoles = {
  user: [
    'getExchanges',
    'managePayments',
    'manageExchanges',
    'manageRegions',
    'getRegions',
    'getPayments',
    'manageStrategies',
    'getUserStrategies',
    'manageUserStrategies',
    'getStrategies',
    'manageSubscriptionPlans',
    'managePayments',
    'getSubscriptionPlans',
    'postPayment',
  ],
  admin: ['getUsers', 'manageUsers'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
