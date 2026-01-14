const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');

dotenv.config();

const checkOrders = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Find latest order
        const orders = await Order.find().sort({ createdAt: -1 }).limit(1);

        if (orders.length === 0) {
            console.log('No orders found.');
        } else {
            console.log('Latest Order:');
            console.log(JSON.stringify(orders[0], null, 2));
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkOrders();
