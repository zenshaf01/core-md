import mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['admin', 'moderator', 'instructor', 'student'],
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
        maxlength: 255
    },
    permissions: {
        type: [String],
        required: true
    }
},{
    timestamps: true,
});

export default mongoose.model('Role', RoleSchema);