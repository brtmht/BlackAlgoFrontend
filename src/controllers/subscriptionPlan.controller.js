const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { subscriptionPlanService } = require('../services');
const { getActiveUser,updateServerTokenById, disconnectConnection } = require('../services/userExchangeConfig.service');
const { getUserStrategyByUser } = require('../services/userStrategy.service');
const mt4Server = require('../middlewares/mt4Server');

// Create subscription plans with stripe
const createSubscriptionPlan = catchAsync(async (req, res) => {
  const subscriptionPlan = await subscriptionPlanService.createSubscription(req.body);
  if (!subscriptionPlan) {
    throw new ApiError(httpStatus['402_MESSAGE']);
  }
  res.status(httpStatus.CREATED).send(subscriptionPlan);
});

// Stripe Apis
const getSubscriptionPlans = catchAsync(async (req, res) => {
  const result = await subscriptionPlanService.getAllStripeSubsPlans(req);
  res.send(result);
});

// you can retrieve a subscription plan by using subscription id from stripe
const retrieveSubscriptionPlan = catchAsync(async (req, res) => {
  const retrieval = await subscriptionPlanService.retrieveStripeSubsPlan(req.params.subscriptionPlanId);
  if (!retrieval) {
    throw new ApiError(httpStatus.BAD_REQUEST);
  }
  res.send(retrieval);
});
// resume a subscription plan
const resumeStripeSubscription = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const activatedSuscription = await subscriptionPlanService.resumeStripeSubscription(req.params.subscriptionPlanId, userId);
  if (!activatedSuscription) {
    throw new ApiError(httpStatus.NOT_IMPLEMENTED);
  }
  res.status(httpStatus.ACCEPTED).send(activatedSuscription);
});
// cancel a subscription
const deactivateSubscriptionPlan = catchAsync(async (req, res) => {
  const deactivatedSuscription = await subscriptionPlanService.deactivateStripeSubscription(req.params.subscriptionPlanId);
  if (!deactivatedSuscription) {
    throw new ApiError(httpStatus.NOT_IMPLEMENTED);
  }
  res.status(httpStatus.ACCEPTED).send(deactivatedSuscription);
});

const deleteStripeSubscriptionPlan = catchAsync(async (req, res) => {
  const deactivatedSuscription = await subscriptionPlanService.deleteStripeSubscription(req.params.subscriptionPlanId);
  if (!deactivatedSuscription) {
    throw new ApiError(httpStatus.NOT_IMPLEMENTED);
  }
  res.status(httpStatus.NO_CONTENT);
});
// db apis
const getAllSubscriptionPlans = catchAsync(async (req, res) => {
  const subscriptionPlan = await subscriptionPlanService.getAllSubscriptionPlans();
  if (!subscriptionPlan) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Empty Data');
  }
  res.send({
    success: true,
    code: 201,
    message: 'Subscription plans listed Successfully',
    data: { result: subscriptionPlan },
  });
});
const getSubscriptionPlan = catchAsync(async (req, res) => {
  const subscriptionPlan = await subscriptionPlanService.getSubscriptionPlanById(req.params.subscriptionPlanId);
  if (!subscriptionPlan) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Data not found');
  }
  res.send({ success: true, code: 201, message: 'Fetch Subscription plan Successfully', data: subscriptionPlan });
});
const updateSubscriptionPlan = catchAsync(async (req, res) => {
  const subscriptionPlan = await subscriptionPlanService.updateSubscriptionPlanById(req.params.subscriptionPlanId, req.body);
  res.send(subscriptionPlan);
});

const deleteSubscriptionPlan = catchAsync(async (req, res) => {
  await subscriptionPlanService.deleteSubscriptionPlanById(req.params.subscriptionPlanId);
  res.status(httpStatus.NO_CONTENT).send();
});
const requestForSubscription = catchAsync(async (req, res) => {
  if (req.body) {
    await subscriptionPlanService.sendSubscriptionMail(req.body);

    res.status(httpStatus.CREATED).json({ success: true, code: httpStatus.CREATED, message: 'Email sent successfully' });
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Data not found');
  }
});

const upgradeSubscriptionPlan = catchAsync(async (req, res) => {
  try {
    const user = await getActiveUser(req.user._id);
    if (user && user?.serverToken) {
      const userSubscription = await getUserStrategyByUser(user.userId);

      if (userSubscription) {
        const subscription = await subscriptionPlanService.getSubscriptionPlanById(userSubscription.subscriptionPlanId);
        let BrokerToken;
        const checkConnection = await mt4Server.checkConnection(user.serverToken);
        let connectionAttempts = 0;

        if (checkConnection?.message) {
          const maxAttempts = 3;
          const ipList = await mt4Server.getServerDataForIps(user.config.server);

          for (const ip of ipList) {
            if (connectionAttempts >= maxAttempts) {
              break;
            }

            let IP;
            let PORT;
            const [address, port] = ip.split(':');

            if (port) {
              IP = address;
              PORT = port;
            } else {
              IP = ip;
              PORT = '443';
            }

            const response = await mt4Server.connect(user, IP, PORT);
            console.log('action: new mt4 token generated');
            if (!response.message) {
              await updateServerTokenById(user.id, response);
              BrokerToken = response;
              break;
            } else {
              connectionAttempts++;
            }
          }
        } else {
          BrokerToken = user.serverToken;
        }
        const userPortfolio = await mt4Server.accountSummary(BrokerToken);
        if (subscription.name === 'Monthly') {
          if (
            subscription.max_portfolio_size === userPortfolio.balance ||
            subscription.max_portfolio_size < userPortfolio.balance
          ) {
            await disconnectConnection(user.userId);
            res.send({ success: false, error_code: 403, message: 'Please upgrade your subscription plan to start your trading' });
          } else if (subscription.max_portfolio_size > userPortfolio.balance) {
            res.send({ success: true, code: 200, message: 'No need to change subscription' });
          }
        }
      } else {
        res.send({ success: true, code: 200, message: 'User subscription not found' });
      }
    }else{
      res.send({ success: true, code: 200, message: 'User Connection not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error_code: 500, message: 'Internal server error' });
  }
});


module.exports = {
  createSubscriptionPlan,
  getSubscriptionPlans,
  retrieveSubscriptionPlan,
  resumeStripeSubscription,
  updateSubscriptionPlan,
  deleteStripeSubscriptionPlan,
  deleteSubscriptionPlan,
  deactivateSubscriptionPlan,
  getSubscriptionPlan,
  getAllSubscriptionPlans,
  requestForSubscription,
  upgradeSubscriptionPlan,
};
