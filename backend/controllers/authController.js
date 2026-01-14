const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    console.log('--- Register Request Received ---');
    console.log('Body:', req.body);
    const { name, email, password, phone, role, aadharNumber, idProofFront, idProofBack, shopPhoto } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        name,
        email,
        password,
        phone,
        phone,
        role: role || 'buyer',
        aadharNumber: req.body.aadharNumber,
        idProofFront: req.body.idProofFront,
        idProofBack: req.body.idProofBack,
        shopPhoto: req.body.shopPhoto
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    console.log('--- Login Attempt ---');
    console.log('Email:', req.body.email);
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        // Check if seller and not approved
        if (user.role === 'seller' && !user.isApproved) {
            if (user.approvalStatus === 'pending') {
                return res.status(403).json({
                    message: 'Your account is pending admin approval. You will be notified once approved.',
                    approvalStatus: 'pending'
                });
            } else if (user.approvalStatus === 'rejected') {
                return res.status(403).json({
                    message: `Your account has been rejected. Reason: ${user.rejectionReason || 'Not specified'}`,
                    approvalStatus: 'rejected',
                    rejectionReason: user.rejectionReason
                });
            }
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Forgot Password - Send reset code
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found with this email' });
        }

        // Generate 6-digit OTP
        const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash the token before storing
        const crypto = require('crypto');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();

        // TODO: Send email with OTP (integrate with email service)
        // For now, we'll return the OTP in response (only for development)
        console.log('Reset OTP for', email, ':', resetToken);

        res.json({
            message: 'Password reset OTP sent to your email',
            // Remove this in production - only for testing
            otp: resetToken
        });
    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset Password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: 'Please provide email, OTP, and new password' });
        }

        // Hash the OTP to compare with stored hash
        const crypto = require('crypto');
        const hashedToken = crypto.createHash('sha256').update(otp).digest('hex');

        const user = await User.findOne({
            email,
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Update password (will be hashed by pre-save hook)
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({
            message: 'Password reset successful',
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword };
