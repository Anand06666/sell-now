const Product = require('../models/Product');

// @desc    Fetch all products with advanced filters
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const pageSize = Number(req.query.limit) || 20;
        const page = Number(req.query.page) || 1;

        // Base query - show available and pending products for now
        const query = { status: { $in: ['available', 'pending_approval'] } };

        // Search Keyword (title or description)
        if (req.query.search) {
            const keyword = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ];
        }

        // Category Filter
        if (req.query.category && req.query.category.match(/^[0-9a-fA-F]{24}$/)) {
            query.category = req.query.category;
        }

        // Subcategory Filter
        if (req.query.subcategory) {
            query.subcategory = req.query.subcategory;
        }

        // Price Range Filter
        if (req.query.minPrice || req.query.maxPrice) {
            query.$or = query.$or || [];
            const priceQuery = {};
            if (req.query.minPrice) priceQuery.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) priceQuery.$lte = Number(req.query.maxPrice);

            // Check both basePrice and price fields
            query.$and = query.$and || [];
            query.$and.push({
                $or: [
                    { basePrice: priceQuery },
                    { price: priceQuery }
                ]
            });
        }

        // Brand Filter
        if (req.query.brand) {
            query['attributes.Brand'] = { $regex: req.query.brand, $options: 'i' };
        }

        // Stock Filter
        if (req.query.inStock === 'true') {
            query.stock = { $gt: 0 };
        }

        // Rating Filter (if rating field exists)
        if (req.query.minRating) {
            query.averageRating = { $gte: Number(req.query.minRating) };
        }

        // Condition Filter
        if (req.query.condition) {
            query.condition = { $regex: req.query.condition, $options: 'i' };
        }

        // Sorting
        let sort = { createdAt: -1 }; // Default: Newest first
        switch (req.query.sort) {
            case 'price_asc':
                sort = { basePrice: 1, price: 1 };
                break;
            case 'price_desc':
                sort = { basePrice: -1, price: -1 };
                break;
            case 'rating':
                sort = { averageRating: -1, createdAt: -1 };
                break;
            case 'popular':
                sort = { totalReviews: -1, createdAt: -1 };
                break;
            case 'newest':
            default:
                sort = { createdAt: -1 };
                break;
        }

        const count = await Product.countDocuments(query);
        const products = await Product.find(query)
            .populate('category', 'name')
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort(sort)
            .lean();

        res.json({
            products,
            page,
            pages: Math.ceil(count / pageSize),
            total: count
        });
    } catch (error) {
        console.error('getProducts Error:', error);

        const fs = require('fs');
        const debugPath = require('path').join(__dirname, '..', 'debug_products.txt');
        fs.appendFileSync(debugPath, `\n[${new Date().toISOString()}] GET PRODUCTS ERROR: ${error.message}\nSTACK: ${error.stack}\n`);

        res.status(500).json({ message: 'Failed to fetch products', error: error.message });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    // Prevent CastError for invalid IDs (like "admin" if route fails)
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({ message: 'Product not found (Invalid ID)' });
    }

    const product = await Product.findById(req.params.id).populate('seller', 'name email profile_image');

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res) => {
    try {
        const {
            title,
            price,  // Legacy field
            basePrice,  // New field
            description,
            image,
            category,
            subcategory,
            condition,
            images,
            stock,
            hasVariants,
            variantConfig,
            variants,
            attributes,
            shippingCost,
            returnPolicy,
            returnWindow
        } = req.body;

        // Validate category exists
        const Category = require('../models/Category');
        const categoryDoc = await Category.findById(category);

        if (!categoryDoc) {
            return res.status(400).json({ message: 'Invalid category' });
        }

        // Validate subcategory exists within the category (if provided)
        if (subcategory) {
            const subcategoryExists = categoryDoc.subcategories.some(
                sub => sub.name === subcategory
            );
            if (!subcategoryExists) {
                return res.status(400).json({ message: 'Invalid subcategory for selected category' });
            }
        }

        // Build product data
        const productData = {
            title,
            description,
            image: image || (images && images[0]),
            images,
            category,
            subcategory,
            condition,
            seller: req.user._id,
            status: 'pending_approval',
            attributes: attributes || {},
            shippingCost: shippingCost ? Number(shippingCost) : 40,
            returnPolicy: returnPolicy || 'return',
            returnWindow: returnWindow ? Number(returnWindow) : 7
        };

        // Handle price fields (support both old and new)
        if (basePrice) {
            productData.basePrice = basePrice;
        } else if (price) {
            productData.price = price;
            productData.basePrice = price; // Set both for compatibility
        }

        // Handle variants
        if (hasVariants) {
            productData.hasVariants = true;
            productData.variantConfig = variantConfig;
            productData.variants = variants;
        } else {
            productData.stock = stock || 0;
        }

        // Parse attributes if sent as a string (common in multipart/form-data)
        let parsedAttributes = attributes;
        if (typeof attributes === 'string') {
            try {
                parsedAttributes = JSON.parse(attributes);
            } catch (e) {
                console.error('Failed to parse attributes JSON', e);
                parsedAttributes = {};
            }
        }

        const product = new Product({
            ...productData,
            attributes: parsedAttributes || {}
        });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error('Create Product Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin/Seller
const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        if (product.seller.toString() === req.user._id.toString() || req.user.role === 'admin') {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(401).json({ message: 'Not authorized to delete this product' });
        }
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user is the seller or admin
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized to update this product' });
    }

    try {
        const {
            title,
            price,
            mrp, // Added MRP
            description,
            category,
            subcategory,
            condition,
            images,
            stock,
            shippingCost,
            hasVariants, // Added Variants support
            variantConfig,
            variants,
            attributes,
            returnPolicy,
            returnWindow
        } = req.body;

        // Validate category if provided and not empty
        if (category && category.trim() !== '') {
            const Category = require('../models/Category');
            const categoryDoc = await Category.findById(category);

            if (!categoryDoc) {
                return res.status(400).json({ message: 'Invalid category' });
            }

            // Validate subcategory if provided
            if (subcategory && subcategory.trim() !== '') {
                const subcategoryExists = categoryDoc.subcategories.some(
                    sub => sub.name === subcategory
                );
                if (!subcategoryExists) {
                    return res.status(400).json({ message: 'Invalid subcategory for selected category' });
                }
            }

            product.category = category;
            product.subcategory = subcategory || '';
        }

        // Update other fields
        if (title) product.title = title;
        if (price) {
            product.price = price;
            product.basePrice = price; // Keep both in sync
        }
        if (mrp !== undefined) product.mrp = Number(mrp); // Update MRP
        if (description !== undefined) product.description = description;
        if (condition) product.condition = condition;
        if (images) product.images = images;

        // Update Attributes
        if (attributes) {
            if (typeof attributes === 'string') {
                try {
                    product.attributes = JSON.parse(attributes);
                } catch (e) {
                    console.error('Failed to parse attributes JSON', e);
                }
            } else {
                product.attributes = attributes;
            }
        }

        // Update Variants logic
        if (hasVariants !== undefined) product.hasVariants = hasVariants;
        if (variantConfig) product.variantConfig = variantConfig;

        if (hasVariants) {
            if (variants) product.variants = variants;
            // If hasVariants is true, main stock is specific to variants usually, 
            // but we might want to keep a total count or just ignore main stock.
            // For safety, if variants are provided, we can sum them up for total stock if needed,
            // or just rely on the variants array.
        } else {
            // Simple product stock update
            if (stock !== undefined) {
                console.log('Updating stock from', product.stock, 'to', stock);
                product.stock = stock >= 0 ? stock : 0;
            }
            // Clear variants if switching to simple
            if (hasVariants === false) {
                product.variants = [];
                product.variantConfig = [];
            }
        }

        if (shippingCost !== undefined) {
            product.shippingCost = Number(shippingCost);
        }

        if (returnPolicy) product.returnPolicy = returnPolicy;
        if (returnWindow !== undefined) product.returnWindow = Number(returnWindow);

        const updatedProduct = await product.save();
        console.log('Product updated successfully. ID:', updatedProduct._id);
        res.json(updatedProduct);
    } catch (error) {
        console.error('Update Product Error:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get my listings
// @route   GET /api/products/mylistings
// @access  Private
const getMyListings = async (req, res) => {
    const products = await Product.find({ seller: req.user._id });
    res.json(products);
};

// @desc    Get all products (Admin)
// @route   GET /api/products/admin
// @access  Private/Admin
const getAdminProducts = async (req, res) => {
    // Admin sees all products regardless of status
    const products = await Product.find({})
        .populate('seller', 'name email')
        .sort({ createdAt: -1 });
    res.json(products);
};

// @desc    Update product status (Approve/Reject)
// @route   PUT /api/products/:id/status
// @access  Private/Admin
const updateProductStatus = async (req, res) => {
    const { status } = req.body; // 'available' or 'rejected'
    const product = await Product.findById(req.params.id);

    if (product) {
        product.status = status;
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getMyListings,
    getAdminProducts,
    updateProductStatus
};
