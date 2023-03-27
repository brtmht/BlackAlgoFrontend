const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const strategyRoute = require('./strategy.route');
const exchangeRoute = require('./exchange.route');
const regionRoute = require('./region.route');
const subscriptionPlanRoute = require('./subscriptionPlan.route');
const userStrategyRoute = require('./userStrategy.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/strategies',
    route: strategyRoute,
  },
  {
    path: '/exchanges',
    route: exchangeRoute,
  },
  {
    path: '/regions',
    route: regionRoute,
  },
  {
    path: '/subscriptionPlans',
    route: subscriptionPlanRoute,
  },
  {
    path: '/userStrategies',
    route: userStrategyRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
