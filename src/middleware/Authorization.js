import Role from "../models/Role.js";
import RequestError from "../errors/RequestError.js";

const authorize = (requiredRoles) => {
    return async (req, res, next) => {
        try {
            // Check if the user is authenticated
            if(!req.user) {
                throw new RequestError('Unauthorized', 401);
            }

            // Check if the user has a role at all
            const role = await Role.findById(req.user.role);
            if (!role) {
                throw new RequestError('Role not found', 403);
            }

            // Check if the user has the required role
            if (!requiredRoles.includes(role.name)) {
                throw new RequestError('Forbidden', 403);
            }
            // If the user has the required role, proceed to the next middleware or route handler
            next();
        } catch (error) {
            next(error);
        }
    }
};

export default authorize;