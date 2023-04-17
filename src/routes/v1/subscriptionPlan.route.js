const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { subscriptionPlanValidation } = require('../../validations');
const { subscriptionPlanController } = require('../../controllers');

const router = express.Router();
router
  .route('/')
  .post(
    auth('postSubscriptionPlans'),
    validate(subscriptionPlanValidation.createSubscriptionPlan),
    subscriptionPlanController.createSubscriptionPlan
  )
  .get(
    auth(),
    validate(subscriptionPlanValidation.getSubscriptionPlans),
    subscriptionPlanController.getAllSubscriptionPlans
  );
router
  .route('/:subscriptionPlanId')
  .get(
    auth('manageSubscriptionPlans'),
    validate(subscriptionPlanValidation.getSubscriptionPlan),
    subscriptionPlanController.retrieveSubscriptionPlan
  )
  .patch(
    auth('manageSubscriptionPlans'),
    validate(subscriptionPlanValidation.updateSubscriptionPlan),
    subscriptionPlanController.updateSubscriptionPlan
  )
  .delete(
    auth('manageSubscriptionPlans'),
    validate(subscriptionPlanValidation.deleteSubscriptionPlan),
    subscriptionPlanController.deleteSubscriptionPlan
  );

router
  .route('/:stripePlansId')
  .get(auth(), validate(subscriptionPlanValidation.getSubscriptionPlan), subscriptionPlanController.retrieveSubscriptionPlan)
  .patch(
    auth(),
    validate(subscriptionPlanValidation.updateSubscriptionPlan),
    subscriptionPlanController.updateSubscriptionPlan
  )
  .delete(
    auth(),
    validate(subscriptionPlanValidation.deleteSubscriptionPlan),
    subscriptionPlanController.deleteSubscriptionPlan
  );
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
 *   post:
 *     summary: Create a subscriptionPlan
 *     description: Only admins can create other subscriptionPlans.
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
 *               - amount
 *               - min_portfolio_size
 *               - max_portfolio_size
 *             properties:
 *               planName:
 *                 type: string
 *               description:
 *                 type: string
 *               amount:
 *                 type: number
 *               min_portfolio_size:
 *                 type: number
 *               max_portfolio_size:
 *                 type: number
 *             example:
 *               name: fake plan
 *               description: fake description
 *               amount: 100
 *               min_portfolio_size: 1000
 *               max_portfolio_size: 10000
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
 *
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
 * /stripePlans/{stripePlansId}:
 *   get:
 *     summary: Retrieve a subscriptionPlan
 *     description: Logged in user can only retrieve their own subscription plan. Only admins can retrieve other subscriptionPlans.
 *     tags: [SubscriptionPlans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subscriptionId:
 *                 type: string
 *             example:
 *               subscriptionId: sub_1Mu7v7Ey4gM8gXFtLa0gDb3n
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
 */
