const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Buyer)
const createOrder = async (req, res) => {
    try {
        const { items, deliveryAddress, paymentMethod, isResellOrder, resellerPrice, margin, deliveryCharge: reqDeliveryCharge } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        if (!deliveryAddress) {
            return res.status(400).json({ message: 'Delivery address is required' });
        }

        // Calculate pricing
        let subtotal = 0;
        let deliveryCharge = reqDeliveryCharge || 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product ${item.product} not found` });
            }

            console.log('--- ORDER DEBUG ---');
            console.log(`Product: ${product.title} (HasVariants: ${product.hasVariants})`);
            console.log(`Payload Item: Size=${item.size}, Qty=${item.quantity}`);
            console.log(`Variants Count: ${product.variants ? product.variants.length : 0}`);
            if (product.variants && product.variants.length > 0) {
                product.variants.forEach(v => console.log(`Variant: Size=${v.size}, Stock=${v.stock}`));
            }
            console.log(`Main Stock: ${product.stock}`);
            console.log('-------------------');

            // detailed checking for variant vs standard product
            let finalPrice = product.price || product.basePrice;

            if (product.hasVariants && product.variants.length > 0) {
                if (!item.size) {
                    return res.status(400).json({ message: `Size selection is required for ${product.title}` });
                }

                // Find the variant - Robust Check with Logging
                const fs = require('fs');
                const debugPath = require('path').join(__dirname, '..', 'logs', 'debug_variant.txt');

                const variantIndex = product.variants.findIndex(v => {
                    let sizeAttr = undefined;
                    const logObj = v.toObject ? v.toObject() : v; // Get clean object for logging

                    // Strategy 1: Direct 'Size' access (Map or Object)
                    if (v.attributes) {
                        const attrs = v.attributes instanceof Map ? Object.fromEntries(v.attributes) : v.attributes;

                        // Direct access (try standard first)
                        sizeAttr = attrs.Size || attrs.size || attrs['Size'];

                        // Strategy 2: Case-Insensitive Key Search in Attributes
                        if (!sizeAttr) {
                            const keys = Object.keys(attrs);
                            const sizeKey = keys.find(k => k.toLowerCase() === 'size');
                            if (sizeKey) sizeAttr = attrs[sizeKey];
                        }

                        // Strategy 3: Check Values if keys fail (Last Resort)
                        if (!sizeAttr) {
                            const values = Object.values(attrs);
                            if (values.includes(item.size)) sizeAttr = item.size;
                        }
                    }

                    // Strategy 4: Flat 'size' property (Legacy)
                    if (!sizeAttr && (v.size || logObj.size)) {
                        sizeAttr = v.size || logObj.size;
                    }

                    // Deep Debug Log
                    fs.appendFileSync(debugPath, `\n[${new Date().toISOString()}] Checking Variant: ${JSON.stringify(logObj)}\nExtracted Size: "${sizeAttr}" vs Target: "${item.size}"\n`);

                    return sizeAttr && item.size && sizeAttr.toString().toLowerCase() === item.size.toString().toLowerCase();
                });

                if (variantIndex === -1) {
                    fs.appendFileSync(debugPath, `[FAILURE] Variant NOT found for Size: "${item.size}"\n`);
                    return res.status(400).json({ message: `Invalid size ${item.size} for ${product.title}` });
                }

                const variant = product.variants[variantIndex];

                if (variant.stock < item.quantity) {
                    return res.status(400).json({
                        message: `Insufficient stock for ${product.title} (Size: ${item.size}). Available: ${variant.stock}`
                    });
                }

                finalPrice = variant.price;

                // Reduce variant stock
                product.variants[variantIndex].stock -= item.quantity;

                // Also update main stock count for general availability
                product.stock = product.variants.reduce((acc, v) => acc + v.stock, 0);

            } else {
                // Standard product logic
                if (product.stock < item.quantity) {
                    return res.status(400).json({
                        message: `Insufficient stock for ${product.title}. Available: ${product.stock}`
                    });
                }
                // Reduce main stock
                product.stock -= item.quantity;
            }

            const itemTotal = finalPrice * item.quantity;
            subtotal += itemTotal;

            orderItems.push({
                product: product._id,
                title: product.title,
                price: finalPrice,
                quantity: item.quantity,
                image: product.images[0],
                size: item.size
            });

            await product.save();
        }

        const total = subtotal + deliveryCharge;

        // Get seller from first product (assuming single seller per order)
        const firstProduct = await Product.findById(items[0].product);

        // Calculate expected delivery (7 days from now)
        const expectedDelivery = new Date();
        expectedDelivery.setDate(expectedDelivery.getDate() + 7);

        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated in controller' });
        }

        const order = new Order({
            buyer: req.user._id,
            // ... (rest of the fields, no change needed here, just context)
            seller: firstProduct.seller,
            items: orderItems,
            pricing: {
                subtotal,
                deliveryCharge,
                discount: 0,
                total,
                // Resell Info
                isResellOrder: isResellOrder || false,
                resellerPrice: resellerPrice || 0,
                margin: margin || 0
            },
            deliveryAddress: {
                name: deliveryAddress.name,
                phone: deliveryAddress.phone,
                addressLine1: deliveryAddress.street, // Map street to addressLine1
                addressLine2: deliveryAddress.addressLine2 || '',
                landmark: deliveryAddress.landmark || '',
                city: deliveryAddress.city,
                state: deliveryAddress.state,
                pincode: deliveryAddress.zip, // Map zip to pincode
                addressType: deliveryAddress.type || 'home'
            },
            paymentMethod: {
                type: paymentMethod || 'cod',
                status: (paymentMethod === 'online' && req.body.isPaid) ? 'paid' : 'pending',
                paymentResult: req.body.paymentResult || {}
            },
            expectedDelivery,
            statusHistory: [{
                status: 'pending',
                timestamp: new Date(),
                note: 'Order placed'
            }]
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        console.error('Create Order Error:', error);

        // Log to file to see it
        const fs = require('fs');
        const debugPath = require('path').join(__dirname, '..', 'logs', 'debug_variant.txt');
        fs.appendFileSync(debugPath, `\n[FATAL ERROR]: ${error.message}\nSTACK: ${error.stack}\n`);

        res.status(500).json({ message: error.message, stack: error.stack, fullError: JSON.stringify(error) });
    }
};

// @desc    Get buyer's orders
// @route   GET /api/orders/buyer
// @access  Private (Buyer)
const getBuyerOrders = async (req, res) => {
    try {
        const { status } = req.query;
        const query = { buyer: req.user._id };

        if (status) {
            query.orderStatus = status;
        }

        const orders = await Order.find(query)
            .populate('seller', 'name email')
            .populate('items.product')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error('Get Buyer Orders Error:', error);

        const fs = require('fs');
        const debugPath = require('path').join(__dirname, '..', 'logs', 'debug_orders.txt');
        fs.appendFileSync(debugPath, `\n[${new Date().toISOString()}] GET ORDERS ERROR: ${error.message}\nSTACK: ${error.stack}\n`);

        res.status(500).json({ message: error.message });
    }
};

// @desc    Get seller's orders
// @route   GET /api/orders/seller
// @access  Private (Seller)
const getSellerOrders = async (req, res) => {
    try {
        const { status } = req.query;
        const query = { seller: req.user._id };

        if (status) {
            query.orderStatus = status;
        }

        const orders = await Order.find(query)
            .populate('buyer', 'name email')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error('Get Seller Orders Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('buyer', 'name email phone')
            .populate('seller', 'name email phone')
            .populate('items.product');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Debug Auth
        const fs = require('fs');
        const debugPath = require('path').join(__dirname, '..', 'logs', 'debug_order_auth.txt');
        const debugInfo = `\n[${new Date().toISOString()}] AUTH CHECK:\nOrder ID: ${order._id}\nUser ID: ${req.user._id}\nUser Role: ${req.user.role}\nBuyer ID: ${order.buyer._id}\nSeller ID: ${order.seller._id}\n`;
        fs.appendFileSync(debugPath, debugInfo);

        // Check authorization (Buyer, Seller, OR Admin)
        const isBuyer = order.buyer._id.toString() === req.user._id.toString();
        const isSeller = order.seller._id.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isBuyer && !isSeller && !isAdmin) {
            fs.appendFileSync(debugPath, `[FAILURE] 403 Forbidden\n`);
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }

        res.json(order);
    } catch (error) {
        console.error('Get Order Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Seller)
const updateOrderStatus = async (req, res) => {
    try {
        const { status, orderStatus, note } = req.body;
        const newStatus = orderStatus || status; // Accept both parameter names

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is the seller
        if (order.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this order' });
        }

        // Update status
        order.orderStatus = newStatus;
        order.statusHistory.push({
            status: newStatus,
            timestamp: new Date(),
            note: note || `Order ${newStatus}`
        });

        // If delivered, set actual delivery date
        if (newStatus === 'delivered') {
            order.actualDelivery = new Date();
        }

        await order.save();
        res.json(order);
    } catch (error) {
        console.error('Update Order Status Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
    try {
        const { reason } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check authorization
        const isBuyer = order.buyer.toString() === req.user._id.toString();
        const isSeller = order.seller.toString() === req.user._id.toString();

        if (!isBuyer && !isSeller) {
            return res.status(403).json({ message: 'Not authorized to cancel this order' });
        }

        // Can only cancel if not shipped/delivered
        if (['shipped', 'out_for_delivery', 'delivered'].includes(order.orderStatus)) {
            return res.status(400).json({ message: 'Cannot cancel order at this stage' });
        }

        // Restore stock
        for (const item of order.items) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }

        order.orderStatus = 'cancelled';
        order.cancellation = {
            isCancelled: true,
            reason,
            cancelledBy: isBuyer ? 'buyer' : 'seller',
            cancelledAt: new Date()
        };
        order.statusHistory.push({
            status: 'cancelled',
            timestamp: new Date(),
            note: reason
        });

        await order.save();
        res.json(order);
    } catch (error) {
        console.error('Cancel Order Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Legacy function for backward compatibility
const getMyOrders = getBuyerOrders;

// exports moved to bottom

// @desc    Request Return
// @route   POST /api/orders/:id/return
// @access  Private (Buyer)
const requestReturn = async (req, res) => {
    try {
        const { reason, images, video } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.buyer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (order.orderStatus !== 'delivered') {
            return res.status(400).json({ message: 'Only delivered orders can be returned' });
        }

        if (order.returnRequest?.isRequested) {
            return res.status(400).json({ message: 'Return already requested' });
        }

        order.returnRequest = {
            isRequested: true,
            reason,
            images: images || [],
            video: video || '',
            status: 'pending',
            requestedAt: new Date()
        };

        await order.save();
        res.json(order);
    } catch (error) {
        console.error('Request Return Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Return Status
// @route   PUT /api/orders/:id/return-status
// @access  Private (Seller)
const updateReturnStatus = async (req, res) => {
    try {
        const { status, rejectionReason, pickupStatus } = req.body; // status: approved/rejected, pickupStatus: out_for_pickup etc.
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (!order.returnRequest?.isRequested) {
            return res.status(400).json({ message: 'No return requested for this order' });
        }

        // --- Handle Main Status (Approve/Reject) ---
        if (status) {
            // Validate rejection reason
            if (status === 'rejected' && !rejectionReason) {
                return res.status(400).json({ message: 'Rejection reason is required' });
            }

            order.returnRequest.status = status;
            if (status === 'rejected' && rejectionReason) {
                order.returnRequest.rejectionReason = rejectionReason;
            }

            // If Approved -> Trigger Shiprocket Return (Internal Call)
            if (status === 'approved' && !order.returnRequest.shiprocketReturn?.orderId) {
                try {
                    // Call the Shiprocket Controller function directly to create return order
                    // We need to mock req/res or abstract the logic. 
                    // For simplicity in this monolithic controller, let's assume we call it via HTTP or direct import if refactored.
                    // Ideally: await shiprocketService.createReturn(order);
                    // For now, we will just set the status. The UI will trigger 'Create Return' via API if needed, 
                    // OR we can rely on the seller to click "Schedule Pickup".
                    // Let's set pickupStatus to 'scheduled' to indicate next step.
                    order.returnRequest.pickupStatus = 'scheduled';
                } catch (e) {
                    console.error('Auto-Return Creation Failed:', e);
                }
            }
        }

        // --- Handle Logistics Status (Pickup Updates) ---
        if (pickupStatus) {
            order.returnRequest.pickupStatus = pickupStatus;

            // IF Received by Seller -> Restore Stock & Finalize
            if (pickupStatus === 'received_by_seller') {
                order.orderStatus = 'returned';

                // Restore Stock
                for (const item of order.items) {
                    const product = await Product.findById(item.product);
                    if (product) {
                        if (item.size && product.hasVariants) {
                            const vIndex = product.variants.findIndex(v => {
                                const vSize = v.attributes?.Size || v.attributes?.size || v.size;
                                return vSize === item.size;
                            });
                            if (vIndex !== -1) {
                                product.variants[vIndex].stock += item.quantity;
                            }
                        }
                        // Restore main stock
                        product.stock += item.quantity;
                        await product.save();
                    }
                }
            }
        }

        await order.save();
        res.json(order);
    } catch (error) {
        console.error('Update Return Status Error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getBuyerOrders,
    getSellerOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
    getMyOrders,
    requestReturn,
    updateReturnStatus
};
