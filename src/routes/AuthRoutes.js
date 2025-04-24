import express from 'express';
import { 
    signup, 
    login, 
    logout, 
    refreshAccessToken, 
    initiateForgotPassword, 
    resetPassword, 
    verifyEmail 
} from '../controllers/AuthController.js';
import authenticate from '../middleware/Authentication.js';

const router = express.Router();

/**
 * @swagger
 * /auth/signup:
 *  post:
 *    summary: User signup
 *    description: Endpoint for user signup
 *    requestBody:
 *      required: true
 *    responses:
 *      201:
 *        description: User created successfully
 *      400:
 *        description: Bad request, invalid input data
 *      500:
 *        description: Internal server error
 */
router.post('/signup', signup);

/**
 * @swagger
 * /auth/login:
 *  post:
 *   summary: User login
 *  description: Endpoint for user login
 *  requestBody:
 *     required: true
 *  responses:
 *     200:
 *       description: User logged in successfully
 *     401:
 *      description: Unauthorized, invalid credentials
 *     500:
 *      description: Internal server error
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/logout:
 *  post:
 *   summary: User logout
 *   description: Endpoint for user logout
 *  requestBody:
 *   required: true
 * responses:
 *  200:
 *   description: User logged out successfully
 *  401:
 *   description: Unauthorized, invalid credentials
 *  500:
 *   description: Internal server error  
 */
router.post('/logout', authenticate, logout);
/**
 * @swagger
 * /auth/refresh-token:
 *  post:
 *   summary: Refresh access token
 *   description: Endpoint for refreshing access token using refresh token
 *   requestBody:
 *     required: true
 *   responses:
 *     200:
 *       description: Access token refreshed successfully
 *     401:
 *       description: Unauthorized, invalid refresh token
 *     500:
 *       description: Internal server error 
 */
router.post('/refresh-token', refreshAccessToken);
/**
 * @swagger
 * /auth/forgot-password:
 *  post:
 *   summary: Initiate forgot password process
 *   description: Endpoint for initiating the forgot password process
 *  requestBody:
 *   required: true
 *  responses:
 *   200:
 *    description: Forgot password process initiated successfully
 *   400: 
 *    description: Bad request, invalid input data
 *   500:
 *    description: Internal server error
 *  
*/
router.post('/forgot-password', initiateForgotPassword);
/**
 * @swagger
 * /auth/reset-password:
 *  post:
 *   summary: Reset password
 *   description: Endpoint for resetting the password
 *   requestBody:
 *     required: true
 *   responses:
 *     200:
 *       description: Password reset successfully
 *     400:
 *       description: Bad request, invalid input data
 *     500:
 *       description: Internal server error 
 */
router.post('/reset-password', resetPassword);

router.post('/verify-email', verifyEmail);

export default router;