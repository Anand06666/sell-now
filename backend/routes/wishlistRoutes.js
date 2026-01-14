const express = require('express');
const router = express.Router();
const {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    checkInWishlist
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.get('/', protect, getWishlist);
router.post('/', protect, addToWishlist);
router.delete('/', protect, clearWishlist);
router.get('/check/:productId', protect, checkInWishlist);
router.delete('/:productId', protect, removeFromWishlist);

module.exports = router;
