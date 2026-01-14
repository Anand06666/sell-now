const express = require('express');
const router = express.Router();
const { getPendingSellers, getAllSellersWithStatus, approveSeller, rejectSeller } = require('../controllers/adminSellerController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes are protected and admin-only
router.get('/pending', protect, admin, getPendingSellers);
router.get('/all', protect, admin, getAllSellersWithStatus);
router.put('/:id/approve', protect, admin, approveSeller);
router.put('/:id/reject', protect, admin, rejectSeller);

module.exports = router;
