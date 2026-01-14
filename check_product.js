const mongoose = require('mongoose');
const Product = require('./backend/models/Product');
require('dotenv').config({ path: './backend/.env' });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

const checkProduct = async () => {
    await connectDB();
    try {
        const product = await Product.findOne({ title: /Cotton T shirt/i });
        if (product) {
            console.log('Product Found:');
            console.log(`ID: ${product._id}`);
            console.log(`Title: ${product.title}`);
            console.log(`HasVariants: ${product.hasVariants}`);
            console.log(`Main Stock: ${product.stock}`);
            console.log(`Variants Count: ${product.variants ? product.variants.length : 0}`);
            if (product.variants) {
                console.log(JSON.stringify(product.variants, null, 2));
            }
        } else {
            console.log('Product not found');
        }
    } catch (error) {
        console.error(error);
    } finally {
        mongoose.connection.close();
    }
};

checkProduct();
