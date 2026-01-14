const express = require('express');
const router = express.Router();
const { getAllOrders, searchOrderByNumber, getOrderDetails } = require('../controllers/adminOrderController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes are protected and admin-only
router.get('/', protect, admin, getAllOrders);
router.get('/search', protect, admin, searchOrderByNumber);
router.get('/:id', protect, admin, getOrderDetails);

module.exports = router;
