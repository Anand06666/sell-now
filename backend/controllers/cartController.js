const Cart = require('../models/Cart');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'title price images stock');

        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        res.json(cart);
    } catch (error) {
        console.error('Get Cart Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
    try {
        const { productId, title, price, image, quantity, size, stock } = req.body;

        if (!productId || !title || !price || !image) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        // Check if item already exists (same product + size)
        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId && item.size === size
        );

        if (existingItemIndex > -1) {
            // Update quantity
            cart.items[existingItemIndex].quantity += quantity || 1;
        } else {
            // Add new item
            cart.items.push({
                product: productId,
                title,
                price,
                image,
                quantity: quantity || 1,
                size,
                stock
            });
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        console.error('Add to Cart Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update item quantity
// @route   PUT /api/cart/:productId
// @access  Private
const updateQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity, size } = req.body;

        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId && (size ? item.size === size : true)
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        cart.items[itemIndex].quantity = Math.max(1, quantity);
        await cart.save();

        res.json(cart);
    } catch (error) {
        console.error('Update Quantity Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const { size } = req.query;

        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(
            item => !(item.product.toString() === productId && (size ? item.size === size : true))
        );

        await cart.save();
        res.json(cart);
    } catch (error) {
        console.error('Remove from Cart Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        await cart.save();

        res.json({ message: 'Cart cleared', cart });
    } catch (error) {
        console.error('Clear Cart Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Sync local cart with server (merge)
// @route   POST /api/cart/sync
// @access  Private
const syncCart = async (req, res) => {
    try {
        const { items } = req.body;

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        // Merge local items with server items
        if (items && Array.isArray(items)) {
            items.forEach(localItem => {
                const existingItemIndex = cart.items.findIndex(
                    item => item.product.toString() === localItem.id && item.size === localItem.size
                );

                if (existingItemIndex > -1) {
                    // Keep higher quantity
                    cart.items[existingItemIndex].quantity = Math.max(
                        cart.items[existingItemIndex].quantity,
                        localItem.quantity
                    );
                } else {
                    // Add local item to server cart
                    cart.items.push({
                        product: localItem.id,
                        title: localItem.title,
                        price: localItem.price,
                        image: localItem.image,
                        quantity: localItem.quantity,
                        size: localItem.size,
                        stock: localItem.stock
                    });
                }
            });

            await cart.save();
        }

        res.json(cart);
    } catch (error) {
        console.error('Sync Cart Error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    syncCart
};
