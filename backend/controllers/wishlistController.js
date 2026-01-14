const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id })
            .populate({
                path: 'items.product',
                select: 'title price basePrice mrp variants images stock averageRating totalReviews hasVariants'
            });

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: req.user._id,
                items: []
            });
        }

        // Filter out any null products (deleted products)
        wishlist.items = wishlist.items.filter(item => item.product !== null);

        res.json(wishlist);
    } catch (error) {
        console.error('Get Wishlist Error:', error);
        res.status(500).json({ message: 'Failed to fetch wishlist', error: error.message });
    }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find or create wishlist
        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: req.user._id,
                items: [{ product: productId }]
            });
        } else {
            // Check if product already in wishlist
            const exists = wishlist.items.some(
                item => item.product.toString() === productId
            );

            if (exists) {
                return res.status(400).json({ message: 'Product already in wishlist' });
            }

            wishlist.items.push({ product: productId });
            await wishlist.save();
        }

        // Populate and return
        wishlist = await Wishlist.findById(wishlist._id)
            .populate({
                path: 'items.product',
                select: 'title price basePrice mrp variants images stock averageRating totalReviews hasVariants'
            });

        res.status(201).json(wishlist);
    } catch (error) {
        console.error('Add to Wishlist Error:', error);
        res.status(500).json({ message: 'Failed to add to wishlist', error: error.message });
    }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        const wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        // Filter out the product
        wishlist.items = wishlist.items.filter(
            item => item.product.toString() !== productId
        );

        await wishlist.save();

        // Populate and return
        const updatedWishlist = await Wishlist.findById(wishlist._id)
            .populate({
                path: 'items.product',
                select: 'title price basePrice mrp variants images stock averageRating totalReviews hasVariants'
            });

        res.json(updatedWishlist);
    } catch (error) {
        console.error('Remove from Wishlist Error:', error);
        res.status(500).json({ message: 'Failed to remove from wishlist', error: error.message });
    }
};

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
const clearWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        wishlist.items = [];
        await wishlist.save();

        res.json({ message: 'Wishlist cleared' });
    } catch (error) {
        console.error('Clear Wishlist Error:', error);
        res.status(500).json({ message: 'Failed to clear wishlist', error: error.message });
    }
};

// @desc    Check if product is in wishlist
// @route   GET /api/wishlist/check/:productId
// @access  Private
const checkInWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        const wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            return res.json({ inWishlist: false });
        }

        const exists = wishlist.items.some(
            item => item.product.toString() === productId
        );

        res.json({ inWishlist: exists });
    } catch (error) {
        console.error('Check Wishlist Error:', error);
        res.status(500).json({ message: 'Failed to check wishlist', error: error.message });
    }
};

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    checkInWishlist
};
