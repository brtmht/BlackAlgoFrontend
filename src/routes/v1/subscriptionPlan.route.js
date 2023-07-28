const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { subscriptionPlanValidation } = require('../../validations');
const { subscriptionPlanController } = require('../../controllers');

const router = express.Router();
router
  .route('/')
  .get(
    auth(),
    validate(subscriptionPlanValidation.getSubscriptionPlans),
    subscriptionPlanController.getAllSubscriptionPlans
  );
router
  .route('/:subscriptionPlanId')
  .get(
    auth('getSubscriptionPlans'),
    validate(subscriptionPlanValidation.getSubscriptionPlan),
    subscriptionPlanController.getSubscriptionPlan
  )
  .patch(
    auth('updateSubscriptionPlans'),
    validate(subscriptionPlanValidation.updateSubscriptionPlan),
    subscriptionPlanController.updateSubscriptionPlan
  )
  .delete(
    auth('deleteSubscriptionPlans'),
    validate(subscriptionPlanValidation.deleteSubscriptionPlan),
    subscriptionPlanController.deleteSubscriptionPlan
  );
router
  .route('/stripe/:subscriptionPlanId')
  .get(auth(), validate(subscriptionPlanValidation.getSubscriptionPlan), subscriptionPlanController.retrieveSubscriptionPlan)
  .delete(
    auth(),
    validate(subscriptionPlanValidation.getSubscriptionPlan),
    subscriptionPlanController.deactivateSubscriptionPlan
  )
  .patch(
    auth(),
    validate(subscriptionPlanValidation.getSubscriptionPlan),
    subscriptionPlanController.resumeStripeSubscription
  );
router
  .route('/requestForSubscription')
  .post(
    auth(),
    validate(subscriptionPlanValidation.requestSubscriptionPlan),
    subscriptionPlanController.requestForSubscription
  );
router.route('/upgradeSubscriptionPlan').post(auth(), subscriptionPlanController.upgradeSubscriptionPlan);
router.route('/terminateSubscription').get(auth('terminateSubscription'), subscriptionPlanController.terminateSubscription);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: SubscriptionPlans
 *   description: SubscriptionPlan management and retrieval
 */

/**
 * @swagger
 * /subscriptionPlans:
 *   get:
 *     summary: Get all subscriptionPlans
 *     description: Only admins can retrieve all subscriptionPlans.
 *     tags: [SubscriptionPlans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SubscriptionPlan'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /subscriptionPlans/{id}:
 *   get:
 *     summary: Get a subscriptionPlan
 *     description: Logged in subscriptionPlans can fetch only their own subscriptionPlan information. Only admins can fetch other subscriptionPlans.
 *     tags: [SubscriptionPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: SubscriptionPlan id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/SubscriptionPlan'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a subscriptionPlan
 *     description: Logged in subscriptionPlans can only update their own information. Only admins can update other subscriptionPlans.
 *     tags: [SubscriptionPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: SubscriptionPlan id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             example:
 *               name: fake name
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/SubscriptionPlan'
 *       "400":
 *         $ref: '#/components/responses/DuplicateName'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a subscriptionPlan
 *     description: Logged in subscriptionPlans can delete only themselves. Only admins can delete other subscriptionPlans.
 *     tags: [SubscriptionPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: SubscriptionPlan id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /subscriptionPlans/stripe/{id}:
 *   get:
 *     summary: Retrieve a subscriptionPlan from  stripe
 *     description: Logged in user can only retrieve their own subscription plan. Only admins can retrieve other subscriptionPlans.
 *     tags: [SubscriptionPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: SubscriptionPlan id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/SubscriptionPlan'
 *       "400":
 *         $ref: '#/components/responses/DuplicateName'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete a stripe subscriptionPlan
 *     description: Logged in subscriptionPlans can delete only themselves. Only admins can delete other subscriptionPlans.
 *     tags: [SubscriptionPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: SubscriptionPlan id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   patch:
 *     summary: resume a stripe subscriptionPlan
 *     description: Logged in user can only resume their cancelled subscriptionPlans.
 *     tags: [SubscriptionPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: SubscriptionPlan id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
/**
 * @swagger
 * /subscriptionPlans/requestForSubscription:
 *   post:
 *     summary: Request a subscriptionPlan
 *     description: User can request a subscriptionPlan.
 *     tags: [SubscriptionPlans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phoneNo
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNo:
 *                 type: number
 *             example:
 *               name: blackalgo
 *               email: blackalgo@yopmail.com
 *               phoneNo: 9876543210
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/SubscriptionPlan'
 *       "400":
 *         $ref: '#/components/responses/DuplicateName'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /subscriptionPlans/upgradeSubscriptionPlan:
 *   post:
 *     summary: Get uprade to user's subscription plan
 *     description: User can get a upgarde on subscriptionPlan.
 *     tags: [SubscriptionPlans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/SubscriptionPlan'
 *       "400":
 *         $ref: '#/components/responses/DuplicateName'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
/**
 * @swagger
 * /subscriptionPlans/terminateSubscription:
 *   get:
 *     summary: Cancel user'ssubscription plan
 *     description: User can cancel thieir subscriptionPlan.
 *     tags: [SubscriptionPlans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/SubscriptionPlan'
 *       "400":
 *         $ref: '#/components/responses/DuplicateName'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
