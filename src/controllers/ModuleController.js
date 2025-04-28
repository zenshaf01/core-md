import CourseModule from '../models/CourseModule.js';
import Course from '../models/Course.js';

// Create a new module for a course
export const createModule = async (req, res) => {
    try {
        const { courseId } = req.params; // Get courseId from URL parameters
        const { title, description } = req.body;

        // Check if the course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Create the module
        const module = new CourseModule({ courseId, title, description });
        await module.save();

        res.status(201).json(module);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all modules for a course
export const getModules = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Check if the course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const modules = await CourseModule.find({ courseId });
        res.status(200).json(modules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single module by ID
export const getModuleById = async (req, res) => {
    try {
        const { id } = req.params;

        const module = await CourseModule.findById(id);
        if (!module) {
            return res.status(404).json({ message: 'Module not found' });
        }

        res.status(200).json(module);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a module
export const updateModule = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        const module = await CourseModule.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }
        );

        if (!module) {
            return res.status(404).json({ message: 'Module not found' });
        }

        res.status(200).json(module);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a module
export const deleteModule = async (req, res) => {
    try {
        const { id } = req.params;

        const module = await CourseModule.findByIdAndDelete(id);
        if (!module) {
            return res.status(404).json({ message: 'Module not found' });
        }

        res.status(200).json({ message: 'Module deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getModuleWithInstructor = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the module and populate the course
        const module = await CourseModule.findById(id).populate({
            path: 'courseId',
            select: 'instructorId title', // Select only the fields you need
        });

        if (!module) {
            return res.status(404).json({ message: 'Module not found' });
        }

        res.status(200).json(module);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};