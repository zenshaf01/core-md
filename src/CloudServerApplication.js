/**
 * This is the entry point of the cloud server
 */
// System-level imports
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Custom middleware imports
import logger from './middleware/Logger.js';
import errorHandler from './middleware/ErrorHandler.js';

// Utility imports
import { asciiArt } from './helpers/Utilities.js';
import seedData from './models/seeds/seeder.js';

//Routes
import healthCheckRoute from './routes/HealthCheckRoute.js';
import userRoutes from './routes/UserRoutes.js';
import authRoutes from './routes/AuthRoutes.js';
import roleRoutes from './routes/RoleRoutes.js';

// Load environment variables from .env file
dotenv.config()

// initializing express app
const app = express();
// Select port
const port = process.env.PORT || 3000;

// middleware
app.use(logger); // This logger logs the incoming request to the console
app.use(express.json()) // This middleware parses the request body and makes it available in req.body
app.use(express.urlencoded({ extended: true })); // This middleware parses the URL-encoded data and makes it available in req.body

/**
 * Connect to MongoDB using mongoose and seed the database with initial data
 */
const initializeDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        await seedData();
        console.log('Database initialization complete.');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);
    }
};

/**
 * Start the server
 * This function listens on the port and logs the port on which the server is running
 */
const startServer = () => {
    app.listen(port, () => {
        console.log(asciiArt);
        console.log(`Server is running on port http://localhost:${port}`);
    });
}

/**
 * Start the application
 * This function connects to the database and starts the server
 */
const startApplication = async () => {
    try {
        console.log('Starting Cloud Server...');
        await initializeDB();
        startServer();
        console.log('Core MD Cloud server successfully initialized.');
    } catch(error) {
        console.error("Failed to initialize cloud server.", error);
    }  
};

// Start the application
startApplication();

// Register routes
app.use('/health-check', healthCheckRoute);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/roles', roleRoutes);

// Error handling middleware
app.use(errorHandler);

/**
 * TODO:
 */