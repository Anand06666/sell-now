const Order = require('../models/Order');

// @desc    Get all orders (Admin only)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const total = await Order.countDocuments();
        const orders = await Order.find()
            .populate('buyer', 'name email phone')
            .populate('seller', 'name email phone businessName')
            .populate('items.product', 'title images price condition')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            orders,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalOrders: total
        });
    } catch (error) {
        console.error('Get All Orders Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Search order by order number
// @route   GET /api/admin/orders/search
// @access  Private/Admin
const searchOrderByNumber = async (req, res) => {
    try {
        const { orderNumber } = req.query;

        if (!orderNumber) {
            return res.status(400).json({ message: 'Order number is required' });
        }

        const order = await Order.findOne({ orderNumber })
            .populate('buyer', 'name email phone')
            .populate('seller', 'name email phone businessName')
            .populate('items.product', 'title images price condition');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Search Order Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order details by ID
// @route   GET /api/admin/orders/:id
// @access  Private/Admin
const getOrderDetails = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('buyer', 'name email phone')
            .populate('seller', 'name email phone businessName')
            .populate('items.product', 'title images price condition');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Get Order Details Error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllOrders,
    searchOrderByNumber,
    getOrderDetails
};
