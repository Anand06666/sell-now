const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const sellerController = require('../controllers/sellerController');

// Get all sellers with analytics (Admin only)
router.get('/analytics', protect, admin, sellerController.getSellersAnalytics);

// Get single seller details (Admin only)
router.get('/:id/details', protect, admin, sellerController.getSellerDetails);

module.exports = router;
