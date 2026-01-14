const User = require('../models/User');

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            profile_image: user.profile_image
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.profile_image = req.body.profile_image || user.profile_image;
        if (req.body.password) {
            user.password = req.body.password;
        }

        if (req.body.bankDetails) {
            user.bankDetails = {
                accountName: req.body.bankDetails.accountName || user.bankDetails.accountName,
                accountNumber: req.body.bankDetails.accountNumber || user.bankDetails.accountNumber,
                ifscCode: req.body.bankDetails.ifscCode || user.bankDetails.ifscCode,
                bankName: req.body.bankDetails.bankName || user.bankDetails.bankName
            };
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            phone: updatedUser.phone,
            profile_image: updatedUser.profile_image,
            token: req.headers.authorization.split(' ')[1] // Return same token
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { getUserProfile, updateUserProfile, getAllUsers };
