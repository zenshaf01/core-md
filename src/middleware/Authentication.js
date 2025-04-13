import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import RequestError from '../errors/RequestError.js';
import TokenBlacklist from '../models/TokenBlacklist.js';

const isAuthenticated = async (req, res, next) => {
    try {
        // Check if the Authorization header is present
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            throw new RequestError('No token provided', 401);
        }

        // Check if the token is blacklisted
        const blacklistedToken = await TokenBlacklist.findOne({ token });
        if (blacklistedToken) {
            throw new RequestError('Token is invalid. Please login again.', 401);
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            throw new RequestError('Unauthorized', 401);
        }

        // Attach the user to the request object for further use in the route handlers
        req.user = user;
        // Move to the next middleware or route handler
        next();
    } catch(error) {
        next(new RequestError('Unauthorized', 401));
    }
};

export default isAuthenticated;
