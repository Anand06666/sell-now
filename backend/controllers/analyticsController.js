const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/analytics/admin
// @access  Private (Admin)
const getAdminAnalytics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({});
        const totalProducts = await Product.countDocuments({});
        const activeOrders = await Order.countDocuments({ status: 'pending' });

        const revenueAggregation = await Order.aggregate([
            { $match: { status: 'delivered' } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalRevenue = revenueAggregation[0]?.total || 0;

        res.json({
            totalUsers,
            totalProducts,
            activeOrders,
            totalRevenue
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Seller Dashboard Stats
// @route   GET /api/analytics/seller
// @access  Private (Seller)
const getSellerAnalytics = async (req, res) => {
    try {
        const sellerId = req.user._id;

        // 1. Total Revenue (Sum of 'delivered' orders)
        const revenueAggregation = await Order.aggregate([
            { $match: { seller: sellerId, orderStatus: 'delivered' } },
            { $group: { _id: null, total: { $sum: "$pricing.total" } } }
        ]);
        const totalRevenue = revenueAggregation[0]?.total || 0;

        // 2. Total Products
        const totalProducts = await Product.countDocuments({ seller: sellerId });

        // 3. Active Listings
        const activeListings = await Product.countDocuments({ seller: sellerId, status: 'available' });

        // 4. Total Orders
        const totalOrders = await Order.countDocuments({ seller: sellerId });

        // 5. Order Status Breakdown
        const ordersByStatus = await Order.aggregate([
            { $match: { seller: sellerId } },
            { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
        ]);

        const statusBreakdown = {
            pending: 0,
            processing: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0
        };
        ordersByStatus.forEach(item => {
            if (statusBreakdown.hasOwnProperty(item._id)) {
                statusBreakdown[item._id] = item.count;
            }
        });

        // 6. Recent Orders (Last 5)
        const recentOrders = await Order.find({ seller: sellerId })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        // 7. Top Selling Products (Top 5)
        const topProducts = await Order.aggregate([
            { $match: { seller: sellerId, orderStatus: 'delivered' } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    totalSold: { $sum: '$items.quantity' },
                    revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' },
            {
                $project: {
                    title: '$productDetails.title',
                    image: { $arrayElemAt: ['$productDetails.images', 0] },
                    totalSold: 1,
                    revenue: 1
                }
            }
        ]);

        // 8. Monthly Revenue (Last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyRevenue = await Order.aggregate([
            {
                $match: {
                    seller: sellerId,
                    orderStatus: 'delivered',
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            { $unwind: '$items' },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        res.json({
            overview: {
                totalRevenue,
                totalProducts,
                activeListings,
                totalOrders
            },
            ordersByStatus: statusBreakdown,
            recentOrders,
            topProducts,
            monthlyRevenue
        });
    } catch (error) {
        console.error('Seller Analytics Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { getSellerAnalytics, getAdminAnalytics };
