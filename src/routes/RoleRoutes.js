
/**
 * This file contains the routes for the role resource
 */
import express from 'express';
import { createRole, deleteRole, getAllRoles, getRoleById, updateRole } from '../controllers/RoleController.js';
import authenticate from '../middleware/Authentication.js';
import authorize from '../middleware/Authorization.js';

const router = express.Router();

// TODO: Should it be allowed to create roles by the nomral organization admin?
// Create a new role
router.post('/', authenticate, authorize(['admin']), createRole);
// Get all roles
router.get('/', authenticate, authorize(['admin']), getAllRoles);
// Get a role by ID
router.get('/:id', authenticate, authorize(['admin']), getRoleById);
// Update a role by ID
router.put('/:id', authenticate, authorize(['admin']), updateRole);
// Delete a role by ID
router.delete('/:id', authenticate, authorize(['admin']), deleteRole);

export default router;