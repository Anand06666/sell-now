const Product = require('../models/Product');

// @desc    Get filter options (brands, price range, etc.)
// @route   GET /api/products/filters
// @access  Public
const getFilterOptions = async (req, res) => {
    try {
        const categoryId = req.query.category;

        // Base query
        const query = { status: 'available' };
        if (categoryId) {
            query.category = categoryId;
        }

        // Get all products matching query
        const products = await Product.find(query).lean();

        // Extract unique brands
        const brands = [...new Set(
            products
                .map(p => p.attributes?.Brand || p.attributes?.brand)
                .filter(Boolean)
        )].sort();

        // Calculate price range
        const prices = products.map(p => p.basePrice || p.price || 0).filter(p => p > 0);
        const priceRange = {
            min: Math.min(...prices, 0),
            max: Math.max(...prices, 0)
        };

        // Get available sizes (from variants or attributes)
        const sizes = new Set();
        products.forEach(p => {
            if (p.variants && p.variants.length > 0) {
                p.variants.forEach(v => {
                    if (v.attributes?.Size) sizes.add(v.attributes.Size);
                });
            }
        });

        // Get available colors
        const colors = new Set();
        products.forEach(p => {
            if (p.variants && p.variants.length > 0) {
                p.variants.forEach(v => {
                    if (v.attributes?.Color) colors.add(v.attributes.Color);
                });
            }
        });

        res.json({
            brands,
            priceRange,
            sizes: Array.from(sizes).sort(),
            colors: Array.from(colors).sort(),
            totalProducts: products.length
        });
    } catch (error) {
        console.error('Get Filter Options Error:', error);
        res.status(500).json({ message: 'Failed to fetch filter options' });
    }
};

module.exports = { getFilterOptions };
