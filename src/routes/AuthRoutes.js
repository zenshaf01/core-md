import express from 'express';
import { signup, login, logout, refreshAccessToken } from '../controllers/AuthController.js';
import isAuthenticated from '../middleware/Authentication.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', isAuthenticated, logout);
router.post('/refresh-token', refreshAccessToken);

export default router;