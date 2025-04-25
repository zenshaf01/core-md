import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const CourseModuleSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

const CourseModule = model('CourseModule', CourseModuleSchema);

export default CourseModule;