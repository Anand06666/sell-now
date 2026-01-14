const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

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

            // Fix it immediately if broken
            if (!product.hasVariants && product.variants && product.variants.length > 0) {
                console.log('FIXING PRODUCT: Setting hasVariants = true');
                product.hasVariants = true;
                // Recalculate main stock
                product.stock = product.variants.reduce((acc, v) => acc + v.stock, 0);
                await product.save();
                console.log('Product updated!');
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
