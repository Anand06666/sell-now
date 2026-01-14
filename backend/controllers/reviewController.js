const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
    try {
        const { productId, orderId, rating, title, comment, images } = req.body;

        // Validation
        if (!productId || !rating || !title || !comment) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({
            product: productId,
            user: req.user._id
        });

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        // Check if verified purchase
        let verified = false;
        if (orderId) {
            const order = await Order.findOne({
                _id: orderId,
                user: req.user._id,
                'items.product': productId
            });
            verified = !!order;
        }

        // Create review
        const review = await Review.create({
            product: productId,
            user: req.user._id,
            order: orderId,
            rating,
            title,
            comment,
            images: images || [],
            verified
        });

        // Update product rating statistics
        await updateProductRating(productId);

        const populatedReview = await Review.findById(review._id)
            .populate('user', 'name')
            .populate('product', 'title');

        res.status(201).json(populatedReview);
    } catch (error) {
        console.error('Create Review Error:', error);
        res.status(500).json({ message: 'Failed to create review', error: error.message });
    }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const sortBy = req.query.sortBy || 'recent'; // recent, helpful, rating_high, rating_low

        let sort = { createdAt: -1 };
        switch (sortBy) {
            case 'helpful':
                sort = { helpfulCount: -1, createdAt: -1 };
                break;
            case 'rating_high':
                sort = { rating: -1, createdAt: -1 };
                break;
            case 'rating_low':
                sort = { rating: 1, createdAt: -1 };
                break;
            default:
                sort = { createdAt: -1 };
        }

        const reviews = await Review.find({ product: productId })
            .populate('user', 'name')
            .sort(sort)
            .limit(limit)
            .skip((page - 1) * limit)
            .lean();

        const total = await Review.countDocuments({ product: productId });

        res.json({
            reviews,
            page,
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        console.error('Get Reviews Error:', error);
        res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
    }
};

// @desc    Get user's reviews
// @route   GET /api/reviews/my
// @access  Private
const getMyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user._id })
            .populate('product', 'title images')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        console.error('Get My Reviews Error:', error);
        res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
    }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
    try {
        const { rating, title, comment, images } = req.body;

        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check ownership
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Update fields
        if (rating) review.rating = rating;
        if (title) review.title = title;
        if (comment) review.comment = comment;
        if (images) review.images = images;

        await review.save();

        // Update product rating
        await updateProductRating(review.product);

        res.json(review);
    } catch (error) {
        console.error('Update Review Error:', error);
        res.status(500).json({ message: 'Failed to update review', error: error.message });
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check ownership
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const productId = review.product;
        await review.deleteOne();

        // Update product rating
        await updateProductRating(productId);

        res.json({ message: 'Review deleted' });
    } catch (error) {
        console.error('Delete Review Error:', error);
        res.status(500).json({ message: 'Failed to delete review', error: error.message });
    }
};

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
const markHelpful = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        review.helpfulCount += 1;
        await review.save();

        res.json({ helpfulCount: review.helpfulCount });
    } catch (error) {
        console.error('Mark Helpful Error:', error);
        res.status(500).json({ message: 'Failed to mark as helpful', error: error.message });
    }
};

// Helper function to update product rating
const updateProductRating = async (productId) => {
    try {
        const reviews = await Review.find({ product: productId });

        if (reviews.length === 0) {
            await Product.findByIdAndUpdate(productId, {
                averageRating: 0,
                totalReviews: 0
            });
            return;
        }

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;

        await Product.findByIdAndUpdate(productId, {
            averageRating: averageRating.toFixed(1),
            totalReviews: reviews.length
        });
    } catch (error) {
        console.error('Update Product Rating Error:', error);
    }
};

module.exports = {
    createReview,
    getProductReviews,
    getMyReviews,
    updateReview,
    deleteReview,
    markHelpful
};
