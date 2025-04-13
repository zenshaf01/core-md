/**
 * This file contains the controller logic for the user resource
 * It contains functions for each of the CRUD operations
 * The controller functions are called by the routes defined in userRoutes.js
 * The controller functions interact with the database through the User model
 */

import RequestError from "../errors/RequestError.js";

/**
 * Create a new user
 * @param {any} req Request object
 * @param {any} res Response object
 */
export const createUser = (req, res) => {
    // Logic to create a new user
    throw new RequestError('Not implemented');
    // res.send('User created');
    // destructure the params

};

/**
 * Get all users
 * @param {any} req Request object
 * @param {any} res Response object
 */
export const getAllUsers = (req, res) => {
    // Logic to get all users
    res.send('Get all users');
    console.log('Get all users');
};

/**
 * Get a user by ID
 * @param {any} req Request object
 * @param {any} res Response object
 */
export const getUserById = (req, res) => {
    // Logic to get a user by ID
    res.send(`Get user with ID ${req.params.id}`);
};

/**
 * Update a user by ID
 * @param {any} req Request object
 * @param {any} res Response object
 */
export const updateUserById = (req, res) => {
    // Logic to update a user by ID
    res.send(`Update user with ID ${req.params.id}`);
};

/**
 * Delete a user by ID
 * @param {any} req Request object
 * @param {any} res Response object
 */
export const deleteUserById = (req, res) => {    
    // Logic to delete a user by ID
    res.send(`Delete user with ID ${req.params.id}`);
};