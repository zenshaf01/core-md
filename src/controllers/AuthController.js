import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Role from '../models/Role.js';
import { isAdmin } from './RoleController.js';
import RequestError from '../errors/RequestError.js';
import TokenBlacklist from '../models/TokenBlacklist.js';
import { sendEmail } from '../helpers/Email.js';

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '1d' });
};

export const seedAdmin = async () => {
    try {
        console.log('Seeding admin user...');
        const adminRole = await Role.findOne({ name: 'admin' });

        const existingAdmins = await User.find({email: process.env.ADMIN_EMAIL, role: adminRole});
        if (existingAdmins.length > 0) {
            console.log('Database already seeded with admin user...');
            return;
        }

        const admin = new User({
            email: process.env.ADMIN_EMAIL,
            name: process.env.ADMIN_NAME,
            passwordHash: await hashPassword(process.env.ADMIN_PASSWORD),
            role: adminRole,
        });

        await admin.save();
        console.log('Admin user seeded successfully.');
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
};

//All endpoints still need validation and error handling

export const refreshAccessToken = async (req, res, next) => {
    try {
        // Get the refresh token from the request body
        const { refreshToken } = req.body;
        if (!refreshToken) {
            throw new RequestError('No refresh token provided.', 401);
        }

        // Check if the refresh token is blacklisted
        // This should be done in a more efficient way, e.g., using Redis or similar
        const isBlacklisted = await TokenBlacklist.findOne({ token: refreshToken });
        if (isBlacklisted) {
            throw new RequestError('Refresh token is blacklisted.', 401);
        }

         // Verify the refresh token
         const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
         const user = await User.findById(decoded.userId);
         if (!user) {
             throw new RequestError('User not found.', 401);
         }

        // Generate a new access token
        const newAccessToken = generateToken(user._id);
        // Generate a new refresh token
        const newRefreshToken = generateRefreshToken(user._id);

        // Blacklist the old refresh token
        const expirationDate = new Date(decoded.exp * 1000);
        await TokenBlacklist.create({ token: refreshToken, expiresAt: expirationDate });

        // Set the new refresh token in an HttpOnly cookie
        // Please investigate this will work and only include when you understand it
        // res.cookie('refreshToken', newRefreshToken, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        //     sameSite: 'Strict',
        // });
        
        res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch(error) {
        next(error);
    }
}

export const signup = async (req, res, next) => {
    try {
        // Validate request body somewhere
        const { email, name, password, roleId } = req.body;

        //Validate request
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new RequestError('Email already in use.', 400);
        }

        const role = await Role.findById(roleId);
        if (!role) {
            throw new RequestError('Invalid role.', 400);
        }
        const isRoleAdmin = await isAdmin(roleId);
        if(isRoleAdmin) {
            throw new RequestError('Cannot create an admin user.', 400);
        }
        // Add a better salt here
        const passwordHash = await hashPassword(password);

        // create user
        const user = new User({
            email,
            name,
            passwordHash,
            role: role
        });

        await user.save();
        await sendVerificationEmail(user);

        res.status(201).json({ message: 'User created successfully.' });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        //Validate request body somewhere
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            throw new RequestError('Invalid email or password.', 401);
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new RequestError('Invalid email or password.', 401);
        }

        const accessToken = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.status(200).json({ user, accessToken, refreshToken });
    } catch (error) {
        next(error);
    }
};


// Token blacklisting should be eventually implemented with redis or similar
export const logout = async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        const refreshToken = req.body?.refreshToken;

        if (!accessToken) {
            throw new RequestError('No token provided.', 401);
        }

        // decode access token to get userId
        const decodedAccessToken = jwt.decode(accessToken);
        if(!decodedAccessToken || !decodedAccessToken.exp) {
            throw new RequestError('Invalid token.', 400);
        }

        // blacklist the access token
        const expirationDate = new Date(decodedAccessToken.exp * 1000);
        await TokenBlacklist.create({ token: accessToken, expiresAt: expirationDate });

        //decode refresh token to get userId if the token is passed
        if(!refreshToken) {
            res.status(200).json({ message: 'Logged out successfully.' });
            return;
        }

        // decode refresh token to get userId if it exists
        const decodedRefreshToken = jwt.decode(refreshToken);
        if (!decodedRefreshToken || !decodedRefreshToken.userId) {
            throw new RequestError('Invalid refresh token.', 400);
        }

        // Blacklist the refresh token
        const expirationDateRefresh = new Date(decodedRefreshToken.exp * 1000);
        await TokenBlacklist.create({ token: refreshToken, expiresAt: expirationDateRefresh });
        
        res.status(200).json({ message: 'Logged out successfully.' });
    } catch(error) {
        next(error);
    }
};

export const initiateForgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            throw new RequestError('Email is required.', 400);
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new RequestError('User not found.', 404);
        }

        // Generate a password reset token (this should be a one-time token)
        const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_RESET_PASSWORD_SECRET, { expiresIn: '1h' });
        // Send the reset token to the user's email (implement email sending logic here)
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        await sendEmail(email, 'Password Reset', 'passwordReset', { 
            name: user.name,
            resetLink
        });

        res.status(200).json({ message: 'Password reset link sent to your email.' });
    } catch (error) {
        next(error);
    }
}

export const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            throw new RequestError('Email and new password are required.', 400);
        }

        //verify the token
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_RESET_PASSWORD_SECRET);
        } catch (error) {
            throw new RequestError('Invalid or expired token.', 400);
        }

        const user = await User.findById(decodedToken.userId);
        if (!user) {
            throw new RequestError('User not found.', 404);
        }

        user.passwordHash = await hashPassword(newPassword);
        await user.save();

        res.status(200).json({ message: 'Password reset successfully.' });
    } catch (error) {
        next(error);
    }
}

export const sendVerificationEmail = async (user) => {
    const verificationToken = jwt.sign({ userId: user._id }, process.env.JWT_EMAIL_VERIFICATION_SECRET, { expiresIn: '24h' });
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    await sendEmail(user.email, 'Email Verification', 'emailVerification', { 
        name: user.name,
        verificationLink
    });
}

export const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.body;
        if (!token) {
            throw new RequestError('Token is required.', 400);
        }

        // Verify the token
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_EMAIL_VERIFICATION_SECRET);
        } catch (error) {
            throw new RequestError('Invalid or expired token.', 400);
        }

        const user = await User.findById(decodedToken.userId);
        if (!user) {
            throw new RequestError('User not found.', 404);
        }

        user.emailVerified = true;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully.' });
    } catch (error) {
        next(error);
    }
}