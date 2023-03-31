const allRoles = {
  user: ['getExchanges','managePayments','manageExchanges','manageRegions','getRegions','manageStrategies','getStrategies','manageSubscriptionPlans','getSubscriptionPlans'],
  admin: ['getUsers', 'manageUsers'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
