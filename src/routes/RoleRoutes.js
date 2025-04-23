
/**
 * This file contains the routes for the role resource
 */
import express from 'express';
import { createRole, deleteRole, getAllRoles, getRoleById, updateRole } from '../controllers/RoleController.js';
import isAuthenticated from '../middleware/Authentication.js';
import hasRole from '../middleware/Authorization.js';

const router = express.Router();

// TODO: Should it be allowed to create roles by the nomral organization admin?
// Create a new role
router.post('/', isAuthenticated, hasRole(['super-admin', 'admin']), createRole);
// Get all roles
router.get('/', isAuthenticated, hasRole(['super-admin', 'admin']), getAllRoles);
// Get a role by ID
router.get('/:id', isAuthenticated, hasRole(['super-admin', 'admin']), getRoleById);
// Update a role by ID
router.put('/:id', isAuthenticated, hasRole(['super-admin', 'admin']), updateRole);
// Delete a role by ID
router.delete('/:id', isAuthenticated, hasRole(['super-admin', 'admin']), deleteRole);

export default router;