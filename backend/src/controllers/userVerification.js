const crypto = require('crypto');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const redisWrapper = require('../config/redis');
const bcrypt = require('bcrypt');
const validator = require('validator');

// Configure nodemailer transporter (example using Gmail SMTP)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Rate limiting configuration (5 requests per 10 minutes per email)
const OTP_RATE_LIMIT = {
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5
};

function generateOTP() {
    return crypto.randomInt(100000, 1000000).toString();
}

async function sendOTPEmail(email, otp) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for Codexa Verification',
        text: `Your OTP code is: ${otp}. It is valid for 10 minutes.`,
        html: `<p>Your OTP code is: <strong>${otp}</strong>. It is valid for 10 minutes.</p>`
    };
    await transporter.sendMail(mailOptions);
}

// Request OTP for email verification
const requestEmailVerificationOTP = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Validate input
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }
        
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email format' });
        }

        // Check rate limiting
        const rateLimitKey = `rate_limit:otp:${email}`;
        const currentCount = await redisWrapper.get(rateLimitKey) || 0;
        
        if (currentCount >= OTP_RATE_LIMIT.max) {
            return res.status(429).json({ 
                success: false, 
                message: 'Too many OTP requests. Please try again later.' 
            });
        }

        const user = await User.findOne({ emailId: email.toLowerCase() });
        if (user && user.emailVerified) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already verified' 
            });
        }

        const otp = generateOTP();
        
        // Store OTP and increment rate limit counter
        // Since we're using a wrapper, we need to handle these operations individually
        await redisWrapper.set(`otp:${email.toLowerCase()}`, otp, 'EX', 600);
        
        // Increment rate limit counter
        const newCount = parseInt(await redisWrapper.get(rateLimitKey) || '0') + 1;
        await redisWrapper.set(rateLimitKey, newCount);
        await redisWrapper.expire(rateLimitKey, OTP_RATE_LIMIT.windowMs / 1000);

        await sendOTPEmail(email, otp);

        res.status(200).json({ 
            success: true, 
            message: 'OTP sent to email' 
        });
    } catch (error) {
        console.error('Error in requestEmailVerificationOTP:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send OTP' 
        });
    }
};

// Verify OTP for email verification
const verifyEmailOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        // Validate input
        if (!email || !otp) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and OTP are required' 
            });
        }
        
        if (!validator.isEmail(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email format' 
            });
        }
        
        if (!/^\d{6}$/.test(otp)) {
            return res.status(400).json({ 
                success: false, 
                message: 'OTP must be 6 digits' 
            });
        }

        const storedOTP = await redisWrapper.get(`otp:${email.toLowerCase()}`);
        if (!storedOTP) {
            return res.status(400).json({ 
                success: false, 
                message: 'OTP expired or not found' 
            });
        }

        if (storedOTP !== otp) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid OTP' 
            });
        }

        // Mark email as verified or create user if not exists
        let user = await User.findOne({ emailId: email.toLowerCase() });
        
        if (!user) {
            // Create user with minimal required fields
            user = new User({ 
                emailId: email.toLowerCase(), 
                emailVerified: true,
                role: 'user',
                firstName: 'User', // Default first name
                lastName: 'Account', // Default last name
                // Add other required fields with default values
            });
        } else {
            user.emailVerified = true;
        }

        await user.save();

        // Delete OTP from Redis
        await redisWrapper.del(`otp:${email.toLowerCase()}`);

        res.status(200).json({ 
            success: true, 
            message: 'Email verified successfully',
            user: {
                email: user.emailId,
                verified: user.emailVerified
            }
        });
    } catch (error) {
        console.error('Error in verifyEmailOTP:', error);
        
        if (error.name === 'ValidationError') {
            // Handle mongoose validation errors
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                success: false, 
                message: 'Validation failed',
                errors: messages 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Failed to verify OTP' 
        });
    }
};

// Forgot password - send reset OTP
const requestPasswordResetOTP = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email is required' 
            });
        }
        
        if (!validator.isEmail(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email format' 
            });
        }

        // Check rate limiting
        const rateLimitKey = `rate_limit:reset_otp:${email.toLowerCase()}`;
        const currentCount = await redisWrapper.get(rateLimitKey) || 0;
        
        if (currentCount >= OTP_RATE_LIMIT.max) {
            return res.status(429).json({ 
                success: false, 
                message: 'Too many OTP requests. Please try again later.' 
            });
        }

        const user = await User.findOne({ emailId: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        const otp = generateOTP();
        
        // Store OTP and increment rate limit counter
        // Since we're using a wrapper, we need to handle these operations individually
        await redisWrapper.set(`resetotp:${email.toLowerCase()}`, otp, 'EX', 600);
        
        // Increment rate limit counter
        const newCount = parseInt(await redisWrapper.get(rateLimitKey) || '0') + 1;
        await redisWrapper.set(rateLimitKey, newCount);
        await redisWrapper.expire(rateLimitKey, OTP_RATE_LIMIT.windowMs / 1000);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Password Reset OTP for Codexa',
            text: `Your password reset OTP is: ${otp}. It is valid for 10 minutes.`,
            html: `<p>Your password reset OTP is: <strong>${otp}</strong>. It is valid for 10 minutes.</p>`
        };
        await transporter.sendMail(mailOptions);

        res.status(200).json({ 
            success: true, 
            message: 'Password reset OTP sent to email' 
        });
    } catch (error) {
        console.error('Error in requestPasswordResetOTP:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send password reset OTP' 
        });
    }
};

// Reset password using OTP
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email, OTP and new password are required' 
            });
        }
        
        if (!validator.isEmail(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email format' 
            });
        }
        
        if (!/^\d{6}$/.test(otp)) {
            return res.status(400).json({ 
                success: false, 
                message: 'OTP must be 6 digits' 
            });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password must be at least 6 characters' 
            });
        }

        const storedOTP = await redisWrapper.get(`resetotp:${email.toLowerCase()}`);
        if (!storedOTP) {
            return res.status(400).json({ 
                success: false, 
                message: 'OTP expired or not found' 
            });
        }

        if (storedOTP !== otp) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid OTP' 
            });
        }

        const user = await User.findOne({ emailId: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Check if new password is same as old password
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'New password cannot be same as old password' 
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        // Delete OTP from Redis
        await redisWrapper.del(`resetotp:${email.toLowerCase()}`);

        res.status(200).json({ 
            success: true, 
            message: 'Password reset successfully' 
        });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to reset password' 
        });
    }
};

// Change password (user logged in)
const changePassword = async (req, res) => {
    try {
        const userId = req.result._id;
        const { oldPassword, newPassword } = req.body;
        
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'Old and new passwords are required' 
            });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: 'New password must be at least 6 characters' 
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) {
            return res.status(400).json({ 
                success: false, 
                message: 'Old password is incorrect' 
            });
        }

        // Check if new password is same as old password
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'New password cannot be same as old password' 
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ 
            success: true, 
            message: 'Password changed successfully' 
        });
    } catch (error) {
        console.error('Error in changePassword:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to change password' 
        });
    }
};

module.exports = {
    requestEmailVerificationOTP,
    verifyEmailOTP,
    requestPasswordResetOTP,
    resetPassword,
    changePassword
};