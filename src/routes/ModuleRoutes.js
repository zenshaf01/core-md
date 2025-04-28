/**
 * @swagger
 * tags:
 *   name: Modules
 *   description: API for managing modules
 */

import express from 'express';
import { createModule, getModules, getModuleById, updateModule, deleteModule, getModuleWithInstructor } from '../controllers/ModuleController.js';
import authenticate from '../middleware/Authentication.js';
import authorize from '../middleware/Authorization.js';
import { validateCreate, validateUpdate } from '../middleware/validations/ModuleValidation.js';

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * /modules:
 *   get:
 *     summary: Get all modules
 *     tags: [Modules]
 *     responses:
 *       200:
 *         description: List of all modules
 */
router.get('/', authenticate, authorize(["admin", "moderator","instructor"]), getModules);

/**
 * @swagger
 * /modules/{id}:
 *   get:
 *     summary: Get a module by ID
 *     tags: [Modules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *     responses:
 *       200:
 *         description: Module data
 */
router.get('/:id', authenticate, authorize(["admin", "moderator","instructor"]), getModuleById);

/**
 * @swagger
 * /modules:
 *   post:
 *     summary: Create a new module
 *     tags: [Modules]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Module created successfully
 */
router.post('/', authenticate, authorize(["admin", "moderator","instructor"]), validateCreate, createModule);

/**
 * @swagger
 * /modules/{id}:
 *   put:
 *     summary: Update a module by ID
 *     tags: [Modules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Module updated successfully
 */
router.put('/:id', authenticate, authorize(["admin", "moderator","instructor"]), validateUpdate, updateModule);

/**
 * @swagger
 * /modules/{id}:
 *   delete:
 *     summary: Delete a module by ID
 *     tags: [Modules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *     responses:
 *       200:
 *         description: Module deleted successfully
 */
router.delete('/:id', authenticate, authorize(["admin", "moderator","instructor"]), deleteModule);

/**
 * @swagger
 * /modules/{id}/instructor:
 *   get:
 *     summary: Get a module with its instructor details
 *     tags: [Modules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *     responses:
 *       200:
 *         description: Module with instructor details
 */
router.get('/:id/instructor', authenticate, authorize(["admin", "moderator","instructor"]), getModuleWithInstructor);

export default router;
