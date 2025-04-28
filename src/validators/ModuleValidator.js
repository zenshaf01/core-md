import Joi from 'joi';

// Validation schema for CourseModule resource
const courseModuleSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(500).optional(),
    isActive: Joi.boolean().default(true),
});

// Validator functions
export const validateCourseModule = (data) => {
    return courseModuleSchema.validate(data, { abortEarly: false });
};

export const validatePartialCourseModule = (data) => {
    const partialSchema = courseModuleSchema.fork(Object.keys(courseModuleSchema.describe().keys), (schema) =>
        schema.optional()
    );
    return partialSchema.validate(data, { abortEarly: false });
};
