import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Invalid email address'],
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    // paymentDetails: {
    //     type: String,
    //     trim: true,
    // },
    avatarUrl: {
        type: String,
        trim: true,
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    resetToken: {
        type: String,
        trim: true,
    },
    resetTokenExpiry: {
        type: Date,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
        trim: true,
    },
    verificationTokenExpiry: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'banned'],
        default: 'active',
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

export default mongoose.model('User', userSchema);