const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const strategyRoute = require('./strategy.route');
const exchangeRoute = require('./exchange.route');
const regionRoute = require('./region.route');
const subscriptionPlanRoute = require('./subscriptionPlan.route');
const userStrategyRoute = require('./userStrategy.route');
const docsRoute = require('./docs.route');
const paymentRoute = require('./payment.route');
const mtRoute = require('./mt.route');
const config = require('../../config/config');
const notificationRoute = require('./notification.route');
const supportRoute = require('./support.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '',
    route: userRoute,
  },
  {
    path: '/payment',
    route: paymentRoute,
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
    path: '/support',
    route: supportRoute,
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
  {
    path: '',
    route: mtRoute,
  },
  {
    path: '/notification',
    route: notificationRoute,
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
