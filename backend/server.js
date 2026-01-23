require('dotenv').config();
const express = require('express');

const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const addressRoutes = require('./routes/addressRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const adminOrderRoutes = require('./routes/adminOrderRoutes');
const adminSellerRoutes = require('./routes/adminSellerRoutes');
const shiprocketRoutes = require('./routes/shiprocketRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

const compression = require('compression');
connectDB();

app.use(compression());

// CORS Configuration - Production Ready
const allowedOrigins = [
    'https://demo.ranx24.com',
    'https://www.demo.ranx24.com',
    'https://frontenddemo.ranx24.com',
    'https://www.frontenddemo.ranx24.com',
    'http://localhost:3000',  // For local development
    'http://localhost:5173',  // Vite dev server
    'http://localhost:5174',  // Vite dev server (alternate port)
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = `The CORS policy for this site does not allow access from origin ${origin}`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin/sellers', adminSellerRoutes);
app.use('/api/shiprocket', shiprocketRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('SERVER ERROR OBJECT:', err);

    const fs = require('fs');
    const path = require('path');
    const debugPath = path.join(__dirname, 'logs', 'debug_server.txt');
    fs.appendFileSync(debugPath, `[FATAL] ${err.message}\nSTACK: ${err.stack}\n`);

    res.status(500).json({
        message: err.message || 'An unexpected error occurred',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

app.get('/', (req, res) => {
    // Health check
    res.send('SellNow API is running...');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
