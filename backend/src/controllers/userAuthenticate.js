const { OAuth2Client } = require('google-auth-library');
const redisWrapper = require("../config/redis");
const validate = require("../utils/validator");
const bcrypt = require('bcrypt');
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const cloudinary = require('cloudinary').v2;
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Initialize Google OAuth2 client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Multer setup for memory storage (buffer)
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(file.originalname.toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) cb(null, true);
        else cb(new Error("Only images are allowed (jpeg, jpg, png)"));
    }
}).single("profileImage");

const register = async (req, res) => {
    try {
        validate(req.body);
        const { firstName, emailId, password, confirmPassword } = req.body;
        if (!firstName || !emailId) throw new Error("Credential Missing");
        if (password !== confirmPassword) throw new Error("Password Doesn't Match");

        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = "user";

        const user = await User.create(req.body);
        const token = jwt.sign({ _id: user._id, emailId: user.emailId, role: "user" }, process.env.JWT_SECRET, { expiresIn: 60 * 60 });

        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id,
        };

        res.cookie("token", token, { maxAge: 60 * 60 * 1000, httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
        res.status(201).json({ user: reply, message: "User Registered Successfully" });
    } catch (err) {
        res.status(401).send("Error :- " + err);
    }
};

const login = async (req, res) => {
    try {
        const { emailId, password } = req.body;
        if (!emailId || !password) throw new Error("Credentials Missing");

        const user = await User.findOne({ emailId });
        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new Error("Invalid Credentials");

        const token = jwt.sign({ _id: user._id, emailId: user.emailId, role: user.role }, process.env.JWT_SECRET, { expiresIn: 60 * 60 });
        res.cookie("token", token, { maxAge: 60 * 60 * 1000, httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });

        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id,
            role: user.role
        };

        res.status(201).json({ user: reply, token: token, message: "Logged In Successfully" });
    } catch (err) {
        res.status(403).send("Error " + err);
    }
};

const logout = async (req, res) => {
    try {
        const { token } = req.cookies;
        await redisWrapper.set(`token:${token}`, "Blocked");

        const payload = jwt.decode(token);
        await redisWrapper.expireAt(`token:${token}`, payload.exp);

        res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
        res.status(200).send("User Logged Out Successfully");
    } catch (err) {
        res.status(401).send("Error : " + err);
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.result._id;
        const user = await User.findById(userId)
            .populate({
                path: 'problemSolved',
                select: 'title difficulty tags createdAt',
                options: { sort: { createdAt: -1 }, limit: 5 }
            })
            .select('-password -confirmPassword -__v');

        if (!user) return res.status(404).json({ message: "User not found" });

        const problemStats = user.problemSolved.reduce((acc, problem) => {
            acc.total++;
            acc[problem.difficulty]++;
            return acc;
        }, { total: 0, easy: 0, medium: 0, hard: 0 });

        res.status(200).json({
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName || '',
                email: user.emailId,
                role: user.role,
                createdAt: user.createdAt,
                problemStats,
                recentSubmissions: user.problemSolved,
                profileImage: user.profileImage,
                emailVerified: user.emailVerified,
                socialLinks: user.socialLinks || {}
            }
        });
    } catch (err) {
        console.error("Error in getProfile:", err);
        res.status(500).json({ error: err.message });
    }
};

const updateProfile = (req, res) => {
    upload(req, res, async function (err) {
        if (err) return res.status(400).json({ error: err.message });

        try {
            const userId = req.result._id;
            const updateData = { ...req.body };

            if (req.file) {
                const uploadToCloudinary = () => {
                    return new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream(
                            { folder: "profileImages", public_id: userId.toString(), overwrite: true },
                            (error, result) => error ? reject(error) : resolve(result)
                        );
                        stream.end(req.file.buffer);
                    });
                };
                const result = await uploadToCloudinary();
                updateData.profileImage = result.secure_url;
            }

            if (updateData.socialLinks) {
                try {
                    updateData.socialLinks = JSON.parse(updateData.socialLinks);
                } catch (e) {
                    return res.status(400).json({ error: "Invalid socialLinks format" });
                }
            }

            const user = await User.findByIdAndUpdate(userId, updateData, { new: true })
                .select('-password -confirmPassword -__v');

            if (!user) return res.status(404).json({ message: "User not found" });

            res.status(200).json({
                message: "Profile updated successfully",
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName || '',
                    email: user.emailId,
                    role: user.role,
                    createdAt: user.createdAt,
                    profileImage: user.profileImage,
                    emailVerified: user.emailVerified,
                    socialLinks: user.socialLinks || {}
                }
            });
        } catch (error) {
            console.error("Error in updateProfile:", error);
            res.status(500).json({ error: error.message });
        }
    });
};

const deleteProfile = async (req, res) => {
    try {
        const userId = req.result._id;
        await User.findByIdAndDelete(userId);
        res.status(200).send("User Deleted Successfully");
    } catch (err) {
        res.status(403).send("Error Occured " + err);
    }
};

const activeUsers = async (req, res) => {
    try {
        const userCount = await User.countDocuments({});
        res.status(200).json({ message: "User count fetched successfully", count: userCount });
    } catch (err) {
        res.status(500).json({ message: "Error while fetching user Count", error: err.message });
    }
};

const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ message: "Token is required" });

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub, email, given_name, family_name, picture } = payload;

        let user = await User.findOne({ emailId: email });

        if (!user) {
            user = new User({
                firstName: given_name,
                lastName: family_name,
                emailId: email,
                password: sub,
                profileImage: picture,
                emailVerified: true,
                role: "user",
                socialLinks: {}
            });
            await user.save();
        }

        const jwtToken = jwt.sign(
            { _id: user._id, emailId: user.emailId, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: 60 * 60 }
        );

        res.cookie("token", jwtToken, { maxAge: 60 * 60 * 1000, httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });

        res.status(200).json({
            user: {
                firstName: user.firstName,
                emailId: user.emailId,
                _id: user._id,
                role: user.role,
                profileImage: user.profileImage,
            },
            message: "Logged in with Google successfully",
        });
    } catch (error) {
        console.error("Google login error:", error);
        res.status(500).json({ message: "Google login failed", error: error.message });
    }
};

module.exports = {
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    deleteProfile,
    activeUsers,
    googleLogin
};
