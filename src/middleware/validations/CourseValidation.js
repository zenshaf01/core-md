import { validateCreateCourse, validateUpdateCourse } from '../../validators/CourseValidator.js';

export const validateCreate = (req, res, next) => {
    const { error } = validateCreateCourse(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

export const validateUpdate = (req, res, next) => {
    const { error } = validateUpdateCourse(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
