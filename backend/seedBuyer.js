require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const seedBuyer = async () => {
    await connectDB();

    const email = 'buyer@example.com';
    const password = 'password123';

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log('Buyer already exists!');
            console.log(`Email: ${email}`);
            console.log(`Password: ${password}`);
            process.exit();
        }

        const user = await User.create({
            name: 'Test Buyer',
            email,
            password,
            phone: '0987654321',
            role: 'buyer'
        });

        console.log('Buyer Created Successfully!');
        console.log(`Email: ${user.email}`);
        console.log(`Password: ${password}`);
        process.exit();
    } catch (error) {
        console.error('Error seeding buyer:', error);
        process.exit(1);
    }
};

seedBuyer();
