import { validateCourseModule, validatePartialCourseModule } from '../../validators/ModuleValidator.js';
export const validateCreate = (req, res, next) => {
    const { error } = validateCourseModule(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}

export const validateUpdate = (req, res, next) => {
    const { error } = validatePartialCourseModule(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}