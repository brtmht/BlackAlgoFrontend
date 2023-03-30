const allRoles = {
  user: ['getExchanges','manageExchanges','manageRegions','getRegions','manageStrategies','getStrategies','manageSubscriptionPlans','getSubscriptionPlans'],
  admin: ['getUsers', 'manageUsers'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
