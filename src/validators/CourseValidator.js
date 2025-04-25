import Joi from 'joi';

// Define the validation schema for Course
const courseSchema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    description: Joi.string().max(1024).optional(),
    price: Joi.number().precision(2).positive().required(),
    feeType: Joi.string().valid('one-time', 'subscription').required(),
    displayPicture: Joi.string().uri().optional(),
    instructorId: Joi.string().required(), // Assuming instructorId is a string (ObjectId)
    subscribers: Joi.array().items(Joi.string()).optional(), // Assuming subscribers is an array of strings (ObjectId)
    published: Joi.boolean().optional(),
});

// Validator function for creating a course
export function validateCreateCourse(data) {
    return courseSchema.validate(data);
}

// Validator function for updating a course
export function validateUpdateCourse(data) {
    // Allow partial updates by making all fields optional
    const updateSchema = courseSchema.fork(Object.keys(courseSchema.describe().keys), (field) =>
        field.optional()
    );
    return updateSchema.validate(data);
}
