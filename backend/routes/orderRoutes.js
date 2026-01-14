const express = require('express');
const router = express.Router();
const { createOrder, getSellerOrders, updateOrderStatus, getMyOrders, getOrderById } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/seller', protect, getSellerOrders);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, updateOrderStatus);
router.put('/:id/cancel', protect, require('../controllers/orderController').cancelOrder);
router.post('/:id/return', protect, require('../controllers/orderController').requestReturn);
router.put('/:id/return-status', protect, require('../controllers/orderController').updateReturnStatus);

module.exports = router;
