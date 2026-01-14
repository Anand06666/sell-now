require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const seedUser = async () => {
    await connectDB();

    const email = 'seller@example.com';
    const password = 'password123';

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log('User already exists!');
            console.log(`Email: ${email}`);
            console.log(`Password: ${password}`);
            process.exit();
        }

        const user = await User.create({
            name: 'Test Seller',
            email,
            password,
            phone: '1234567890',
            role: 'seller'
        });

        console.log('User Created Successfully!');
        console.log(`Email: ${user.email}`);
        console.log(`Password: ${password}`);
        process.exit();
    } catch (error) {
        console.error('Error seeding user:', error);
        process.exit(1);
    }
};

seedUser();
