const express = require('express');
const auth = require('../../middlewares/auth');
const { notificationController } = require('../../controllers');
const validate = require('../../middlewares/validate');
const { notificationValidation } = require('../../validations');

const router = express.Router();

router
  .route('/')
  .post(
    auth('firebaseToken'),
    validate(notificationValidation.createNotification),
    notificationController.createNotificationToken
  )
  .get(auth('firebaseToken'), notificationController.getUserNotifications);
router
  .route('/:notificationId')
  .get(notificationController.getNotificationWithId)
  .patch(notificationController.updateNotification)
  .delete(notificationController.deleteNotification);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: Notification management
 */

/**
 * @swagger
 * /notification:
 *   post:
 *     summary: Create a notification
 *     description: Only events can create notification.
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - message
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               type:
 *                 type: string
 *               token:
 *                 type: string;
 *             example:
 *               title: test
 *               message: you got a notification from blackalgo
 *               type: alert
 *               token: fw3c14GLiI_0M1d2CXVwkE:APA91bGmSmpZA7B-3b_YaEOZKlpaOTd-2zGelM60XZWaP2rkzoFC_1QjLW0KAaFLj2pJr07I0T8AIn4qyfwFkgFJ9oDbU36F-3A6BoqSzHktAne2_xjTWOoawGsiGN43rNj6i0_OFR6h
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Notification'
 *       "400":
 *         $ref: '#/components/responses/DuplicateName'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *   get:
 *     summary: get a user's notification
 *     description: Only logged in user can get notification.
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *             example:
 *               title: test
 *               message: you got a notification from blackalgo
 *               type: alert
 *               token: fw3c14GLiI_0M1d2CXVwkE:APA91bGmSmpZA7B-3b_YaEOZKlpaOTd-2zGelM60XZWaP2rkzoFC_1QjLW0KAaFLj2pJr07I0T8AIn4qyfwFkgFJ9oDbU36F-3A6BoqSzHktAne2_xjTWOoawGsiGN43rNj6i0_OFR6h
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Notification'
 *       "400":
 *         $ref: '#/components/responses/DuplicateName'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /notification/{id}:
 *   get:
 *     summary: Get a notification
 *     description: Notification can be accessed by their IDs.
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Exchange'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   patch:
 *     summary: Update a Notification
 *     description: Logged in exchanges can only update their own information. Only admins can update other exchanges.
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isRead:
 *                 type: boolean
 *             example:
 *               idRead: true
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Exchange'
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
 *     summary: Delete a Notification
 *     description: Logged in Users can delete notifications.
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification id
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
