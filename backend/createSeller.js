require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const createSeller = async () => {
    await connectDB();

    // --- CHANGE THESE VALUES IF YOU WANT A DIFFERENT USER ---
    const email = 'seller@sellnow.com';
    const password = 'password123';
    const name = 'New Seller';
    const phone = '9876543210';
    // --------------------------------------------------------

    try {
        // Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
            console.log('Seller user already exists.');
            // Update role to be sure
            user.role = 'seller';
            user.password = password; // Reset password to be sure
            user.approvalStatus = 'approved'; // Auto-approve for testing
            user.isApproved = true;
            await user.save();
            console.log('Seller password reset to: ' + password);
            console.log('Seller is now APPROVED.');
        } else {
            user = await User.create({
                name,
                email,
                password,
                phone,
                role: 'seller',
                approvalStatus: 'approved', // Auto-approve for testing
                isApproved: true,
                isBlocked: false
            });
            console.log('New Seller User Created!');
        }

        console.log('-----------------------------------');
        console.log('Email: ' + email);
        console.log('Password: ' + password);
        console.log('Role: Seller (Approved)');
        console.log('-----------------------------------');
        process.exit();
    } catch (error) {
        console.error('Error creating seller:', error);
        process.exit(1);
    }
};

createSeller();
