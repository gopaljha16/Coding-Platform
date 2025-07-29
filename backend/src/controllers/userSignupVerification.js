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

// Signup with email verification OTP sending
const signupWithVerification = async (req, res) => {
    try {
        const { firstName, emailId, password, confirmPassword } = req.body;

        // Validate inputs
        if (!firstName || !emailId || !password || !confirmPassword) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        if (!validator.isEmail(emailId)) {
            return res.status(400).json({ success: false, message: 'Invalid email format' });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Passwords do not match' });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ emailId: emailId.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User with this email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with emailVerified false
        const user = new User({
            firstName,
            emailId: emailId.toLowerCase(),
            password: hashedPassword,
            role: 'user',
            emailVerified: false
        });
        await user.save();

        // Generate OTP and store in Redis
        const otp = generateOTP();
        await redisWrapper.set(`otp:${emailId.toLowerCase()}`, otp, 'EX', 600);

        // Send OTP email
        await sendOTPEmail(emailId, otp);

        res.status(201).json({
            success: true,
            message: 'User registered successfully. OTP sent to email for verification.',
            user: {
                _id: user._id,
                firstName: user.firstName,
                emailId: user.emailId,
                emailVerified: user.emailVerified
            }
        });
    } catch (error) {
        console.error('Error in signupWithVerification:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Verify OTP and mark user as verified
const verifySignupOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP are required' });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email format' });
        }
        if (!/^\d{6}$/.test(otp)) {
            return res.status(400).json({ success: false, message: 'OTP must be 6 digits' });
        }

        const storedOTP = await redisWrapper.get(`otp:${email.toLowerCase()}`);
        if (!storedOTP) {
            return res.status(400).json({ success: false, message: 'OTP expired or not found' });
        }
        if (storedOTP !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        const user = await User.findOne({ emailId: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.emailVerified = true;
        await user.save();

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
        console.error('Error in verifySignupOTP:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = {
    signupWithVerification,
    verifySignupOTP
};
