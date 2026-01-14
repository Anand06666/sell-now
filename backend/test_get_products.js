const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Category = require('./models/Category');

dotenv.config();

const testGetProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Mimic index.tsx query
        // const { data } = await api.get('/products', { params }) without params (initial load)
        const query = { status: { $in: ['available', 'pending_approval'] } };
        const pageSize = 20;

        const count = await Product.countDocuments(query);
        console.log(`Found ${count} products matching query`);

        const products = await Product.find(query)
            .populate('category', 'name')
            .limit(pageSize)
            .sort({ createdAt: -1 })
            .lean();

        console.log(`Fetched ${products.length} products.`);

        // Simulate frontend logic that iterates variants
        products.forEach(p => {
            if (p.hasVariants && p.variants && p.variants.length > 0) {
                const prices = p.variants.map(v => v.price).filter(x => x > 0);
                const stock = p.variants.reduce((acc, v) => acc + (v.stock || 0), 0);
            }
        });

        console.log('Frontend logic simulation passed.');
        process.exit(0);
    } catch (error) {
        console.error('CRASH REPRODUCED:', error);
        process.exit(1);
    }
};

testGetProducts();
