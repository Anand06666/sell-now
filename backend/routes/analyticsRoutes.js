const express = require('express');
const router = express.Router();
const { getSellerAnalytics, getAdminAnalytics } = require('../controllers/analyticsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/seller', protect, getSellerAnalytics);
router.get('/admin', protect, admin, getAdminAnalytics);

module.exports = router;
