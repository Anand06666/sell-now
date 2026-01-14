const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const testGetOrders = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const buyerId = '694ba926b38b03f9b7cd47fa'; // Taken from check_orders.js output
        console.log(`Fetching orders for buyer: ${buyerId}`);

        const orders = await Order.find({ buyer: buyerId })
            .populate('seller', 'name email')
            .populate('items.product')
            .sort({ createdAt: -1 });

        console.log(`Found ${orders.length} orders.`);

        if (orders.length > 0) {
            console.log('First order ID:', orders[0]._id);
            console.log('First order Items:', JSON.stringify(orders[0].items, null, 2));
        }

        process.exit(0);
    } catch (error) {
        console.error('CRASH REPRODUCED:', error);
        process.exit(1);
    }
};

testGetOrders();
