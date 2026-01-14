const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateQuantity, removeFromCart, clearCart, syncCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getCart)
    .post(protect, addToCart)
    .delete(protect, clearCart);

router.post('/sync', protect, syncCart);

router.route('/:productId')
    .put(protect, updateQuantity)
    .delete(protect, removeFromCart);

module.exports = router;
