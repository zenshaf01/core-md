import express from 'express';

// Import individual route modules
import userRoutes from './UserRoutes.js';
import authRoutes from './AuthRoutes.js';
import roleRoutes from './RoleRoutes.js';
import courseRoutes from './CourseRoutes.js';
import moduleRoutes from './ModuleRoutes.js';
import healthCheckRoute from './HealthCheckRoute.js';

const apiRouter = express.Router();

// Register routes with the API router
apiRouter.use('/health-check', healthCheckRoute);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/roles', roleRoutes);
apiRouter.use('/courses', courseRoutes);
apiRouter.use('/modules', moduleRoutes);

// Create a versioned router
const versionedRouter = express.Router();
versionedRouter.use('/v1', apiRouter);

export default versionedRouter;


