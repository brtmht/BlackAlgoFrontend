const express = require('express');
const validate = require('../../middlewares/validate');
const { authValidation } = require('../../validations');
const { adminController } = require('../../controllers');

const router = express.Router();

router.post('/login', validate(authValidation.login), adminController.adminlogin);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Authentication for admin
 */

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Invalid email or password
 */
