const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const products = await Product.find().sort({ createdAt: -1 }).limit(5);
        products.forEach(p => {
            console.log(`Product: ${p.title}`);
            console.log('Images:', p.images);
        });
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
run();
