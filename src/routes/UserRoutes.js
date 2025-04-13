/**
 * This file contains the routes for the user resource
 */
import express from 'express';
import { createUser, getAllUsers, getUserById, updateUserById, deleteUserById } from '../controllers/UserController.js';
import isAuthenticated from '../middleware/Authentication.js';

const router = express.Router();

// Create a new user
router.post('/', isAuthenticated, createUser);
// Get all users
router.get('/', isAuthenticated, getAllUsers);
// Get a user by ID
router.get('/:id', isAuthenticated, getUserById);
// Update a user by ID
router.put('/:id', isAuthenticated, updateUserById);
// Delete a user by ID
router.delete('/:id', isAuthenticated, deleteUserById);

export default router;