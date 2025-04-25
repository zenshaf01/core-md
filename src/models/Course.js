import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const courseSchema = new Schema({
        instructorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        displayPicture: {
            type: String,
            required: false,
        },
        price: {
            type: Number,
            required: true,
        },
        feeType: {
            type: String,
            enum: ['one-time', 'subscription'],
            required: true,
        },
        subscribers: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User',
            default: [],
        },
        published: {
            type: Boolean,
            default: false,
        },
    },{
        timestamps: true, 
    }
);

const Course = model('Course', courseSchema);

export default Course;