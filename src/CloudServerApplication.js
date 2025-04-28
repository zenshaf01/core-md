/**
 * This is the entry point of the cloud server
 */
// System-level imports
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

// Custom middleware imports
import logger from './middleware/Logger.js';
import errorHandler from './middleware/ErrorHandler.js';

// Utility imports
import { asciiArt } from './helpers/Utilities.js';
import seedData from './models/seeds/seeder.js';
import { initializeEmailService } from './helpers/Email.js';

//Main Api router
import apiRoutes from './routes/ApiRoutes.js';

// Load environment variables from .env file
dotenv.config();

// console.log('Environment variables loaded.', process.env);

// Set up Swagger options
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Core MD Cloud API',
            version: '1.0.0',
            description: 'API documentation for Core MD Cloud',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT authorization header', 
                }
            }
        }
    },
    apis: ['./src/routes/*.js'],
};

// initializing express app
const app = express();
// Select port
const port = process.env.PORT || 3000;
// Initialize Swagger documentation
const swaggerDocs = swaggerJsDoc(swaggerOptions);

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
        await initializeDB();
        initializeEmailService();
        console.log('Starting Cloud Server...');
        startServer();
        console.log('Core MD Cloud server successfully initialized.');
    } catch(error) {
        console.error("Failed to initialize cloud server.", error);
    }  
};

// Start the application
startApplication();

// Register routes
app.use('/api', apiRoutes);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs)); // Serve Swagger UI

// Error handling middleware
app.use(errorHandler);

/**
 * TODO:
 * - Implement organization controller and routes and logic
 * - Implement course resource
 * - Implement email verification functionality - just have to run and check.....
 * - Implement update user information functionality (name, password, email, etc)
 * - IMplement Social signup and login
 * - Implement Course resource
 * - Implement Course subscription resource
 * - Implement Module resource
 * - Implement Lecture resource
 * - Implement Exam resource
 */