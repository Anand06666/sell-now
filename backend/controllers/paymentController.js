const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Payment = require('../models/Payment');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_xxxxxxxx',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_secret_key'
});

// @desc    Create Razorpay order
// @route   POST /api/payments/create
// @access  Private
const createPaymentOrder = async (req, res) => {
    try {
        const { amount, orderId } = req.body;

        // Validation
        if (!amount || !orderId) {
            return res.status(400).json({ message: 'Amount and Order ID required' });
        }

        // Check if order exists
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if order belongs to user
        if (order.buyer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Create Razorpay order
        const options = {
            amount: amount * 100, // amount in smallest currency unit (paise)
            currency: 'INR',
            receipt: orderId,
            payment_capture: 1, // Auto capture
        };

        const razorpayOrder = await razorpay.orders.create(options);

        // Save payment record
        const payment = await Payment.create({
            order: orderId,
            user: req.user._id,
            amount: amount,
            razorpayOrderId: razorpayOrder.id,
            status: 'pending',
            method: 'online'
        });

        res.status(201).json({
            success: true,
            order: razorpayOrder,
            payment: payment
        });
    } catch (error) {
        console.error('Create Payment Order Error:', error);

        const fs = require('fs');
        const debugPath = require('path').join(__dirname, '..', 'logs', 'debug_payment_online.txt');
        const errorContent = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
        fs.appendFileSync(debugPath, `\n[${new Date().toISOString()}] ONLINE PAYMENT ERROR:\n${errorContent}\n`);

        res.status(500).json({ message: 'Failed to create payment order', error: error.message || error });
    }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId
        } = req.body;

        // Create signature
        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'your_secret_key')
            .update(sign.toString())
            .digest('hex');

        // Verify signature
        if (razorpay_signature === expectedSign) {
            // Payment verified
            // Update payment record
            const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
            if (payment) {
                payment.razorpayPaymentId = razorpay_payment_id;
                payment.razorpaySignature = razorpay_signature;
                payment.status = 'completed';
                payment.paidAt = Date.now();
                await payment.save();
            }

            // Update order
            const order = await Order.findById(orderId);
            if (order) {
                order.isPaid = true;
                order.paidAt = Date.now();
                order.paymentMethod = {
                    type: 'online',
                    status: 'paid'
                };
                order.paymentResult = {
                    id: razorpay_payment_id,
                    status: 'completed',
                    update_time: Date.now()
                };
                await order.save();
            }

            res.json({
                success: true,
                message: 'Payment verified successfully',
                payment: payment
            });
        } else {
            // Invalid signature
            res.status(400).json({
                success: false,
                message: 'Invalid payment signature'
            });
        }
    } catch (error) {
        console.error('Verify Payment Error:', error);
        res.status(500).json({ message: 'Payment verification failed', error: error.message });
    }
};

// @desc    Handle COD order
// @route   POST /api/payments/cod
// @access  Private
const handleCOD = async (req, res) => {
    try {
        const { orderId } = req.body;

        // Check if order exists
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if order belongs to user
        if (order.buyer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Create payment record for COD
        const payment = await Payment.create({
            order: orderId,
            user: req.user._id,
            amount: order.pricing.total,
            status: 'pending',
            method: 'cod'
        });

        // Update order
        order.paymentMethod = {
            type: 'cod',
            status: 'pending'
        };
        order.isPaid = false; // Will be marked paid on delivery
        await order.save();

        res.json({
            success: true,
            message: 'COD order created successfully',
            payment: payment,
            order: order
        });
    } catch (error) {
        console.error('COD Error:', error);

        const fs = require('fs');
        const debugPath = require('path').join(__dirname, '..', 'logs', 'debug_cod.txt');
        fs.appendFileSync(debugPath, `\n[${new Date().toISOString()}] COD ERROR: ${error.message}\nSTACK: ${error.stack}\n`);

        res.status(500).json({ message: 'Failed to create COD order', error: error.message });
    }
};

// @desc    Get payment details
// @route   GET /api/payments/:id
// @access  Private
const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate('user', 'name email')
            .populate('order');

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Check authorization
        if (payment.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(payment);
    } catch (error) {
        console.error('Get Payment Error:', error);
        res.status(500).json({ message: 'Failed to fetch payment', error: error.message });
    }
};

// @desc    Get user's payment history
// @route   GET /api/payments/my/history
// @access  Private
const getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.user._id })
            .populate('order')
            .sort({ createdAt: -1 });

        res.json(payments);
    } catch (error) {
        console.error('Get My Payments Error:', error);
        res.status(500).json({ message: 'Failed to fetch payments', error: error.message });
    }
};

module.exports = {
    createPaymentOrder,
    verifyPayment,
    handleCOD,
    getPaymentById,
    getMyPayments
};
