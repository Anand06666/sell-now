require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const createAdmin = async () => {
    await connectDB();

    const email = 'admin@sellnow.com';
    const password = 'password123';

    try {
        // Check if admin already exists
        let user = await User.findOne({ email });

        if (user) {
            console.log('Admin user already exists.');
            // Update role to be sure
            user.role = 'admin';
            user.password = password; // Reset password to be sure
            await user.save();
            console.log('Admin password reset to: ' + password);
        } else {
            user = await User.create({
                name: 'Super Admin',
                email,
                password,
                phone: '0000000000',
                role: 'admin',
                isBlocked: false
            });
            console.log('New Admin User Created!');
        }

        console.log('-----------------------------------');
        console.log('Email: ' + email);
        console.log('Password: ' + password);
        console.log('-----------------------------------');
        process.exit();
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
