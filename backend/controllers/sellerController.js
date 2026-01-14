const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get all sellers with analytics
// @route   GET /api/sellers/analytics
// @access  Admin
exports.getSellersAnalytics = async (req, res) => {
    try {
        // Get all sellers
        const sellers = await User.find({ role: 'seller' })
            .select('name email phone created_at')
            .lean();

        // Get analytics for each seller
        const sellersWithStats = await Promise.all(
            sellers.map(async (seller) => {
                // Product stats
                const products = await Product.find({ seller: seller._id });
                const totalProducts = products.length;
                const activeProducts = products.filter(p => p.status === 'available').length;

                // Order stats
                const orders = await Order.find({ seller: seller._id });
                const totalOrders = orders.length;
                const completedOrders = orders.filter(o => o.orderStatus === 'delivered').length;
                const pendingOrders = orders.filter(o => o.orderStatus === 'pending').length;

                // Revenue calculation (sum of delivered orders)
                const totalRevenue = orders
                    .filter(o => o.orderStatus === 'delivered')
                    .reduce((sum, order) => sum + (order.pricing?.total || 0), 0);

                return {
                    ...seller,
                    stats: {
                        totalProducts,
                        activeProducts,
                        totalOrders,
                        completedOrders,
                        pendingOrders,
                        totalRevenue
                    }
                };
            })
        );

        // Sort by revenue (highest first)
        sellersWithStats.sort((a, b) => b.stats.totalRevenue - a.stats.totalRevenue);

        res.json(sellersWithStats);
    } catch (error) {
        console.error('Seller Analytics Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get single seller details with recent activity
// @route   GET /api/sellers/:id/details
// @access  Admin
exports.getSellerDetails = async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const sellerId = req.params.id;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(sellerId)) {
            return res.status(400).json({ message: 'Invalid seller ID' });
        }

        const seller = await User.findById(sellerId).select('-password');

        if (!seller || seller.role !== 'seller') {
            return res.status(404).json({ message: 'Seller not found' });
        }

        // Recent products (last 10)
        const recentProducts = await Product.find({ seller: sellerId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('title price basePrice hasVariants variants images status createdAt');

        // Recent orders (last 10)
        const recentOrders = await Order.find({ seller: sellerId })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('buyer', 'name email')
            .populate('items.product', 'title price');

        // Monthly revenue (last 12 months) - fixed with proper ObjectId conversion
        const monthlyRevenue = await Order.aggregate([
            {
                $match: {
                    seller: new mongoose.Types.ObjectId(sellerId),
                    orderStatus: 'delivered',
                    createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)) }
                }
            },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    revenue: { $sum: '$pricing.total' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            seller,
            recentProducts,
            recentOrders,
            monthlyRevenue
        });
    } catch (error) {
        console.error('Seller Details Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
