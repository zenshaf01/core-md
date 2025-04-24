/**
 * This file contains the routes for the user resource
 */
import express from 'express';
import { createUser, getAllUsers, getUserById, updateUserById, deleteUserById } from '../controllers/UserController.js';
import authenticate from '../middleware/Authentication.js';

const router = express.Router();

// Generate swagger docs for this
router.post('/', authenticate, createUser);
// Get all users
router.get('/', authenticate, getAllUsers);
// Get a user by ID
router.get('/:id', authenticate, getUserById);
// Update a user by ID
router.put('/:id', authenticate, updateUserById);
// Delete a user by ID
router.delete('/:id', authenticate, deleteUserById);

export default router;