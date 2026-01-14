const express = require('express');
const router = express.Router();
const {
    createPaymentOrder,
    verifyPayment,
    handleCOD,
    getPaymentById,
    getMyPayments
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.post('/create', protect, createPaymentOrder);
router.post('/verify', protect, verifyPayment);
router.post('/cod', protect, handleCOD);
router.get('/my/history', protect, getMyPayments);
router.get('/:id', protect, getPaymentById);

module.exports = router;
