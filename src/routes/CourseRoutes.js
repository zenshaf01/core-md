/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: API for managing courses
 */

import express from 'express';
import authenticate from '../middleware/Authentication.js';
import authorize from '../middleware/Authorization.js';
import { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse, subscribeToCourse } from '../controllers/CourseController.js';
import { validateCreate, validateUpdate } from '../middleware/validations/CourseValidation.js';

const router = express.Router();

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of all courses
 */
router.get('/', authenticate, getAllCourses);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *     responses:
 *       200:
 *         description: Course data
 */
router.get('/:id', authenticate, getCourseById);

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
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
 *         description: Course created
 */
router.post('/', authenticate, authorize(["admin", "moderator", "instructor"]), validateCreate, createCourse);

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Update a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
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
 *         description: Course updated
 */
router.put('/:id', authenticate, authorize(["admin", "moderator", "instructor"]), validateUpdate, updateCourse);

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Delete a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *     responses:
 *       200:
 *         description: Course deleted
 */
router.delete('/:id', authenticate, authorize(["admin", "moderator", "instructor"]), deleteCourse);

/**
 * @swagger
 * /courses/{id}/subscribe:
 *   post:
 *     summary: Subscribe to a course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *     responses:
 *       200:
 *         description: Successfully subscribed to the course
 */
router.post('/:id/subscribe', authenticate, authorize(["student"]), subscribeToCourse);

export default router;