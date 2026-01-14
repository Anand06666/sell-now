const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        title: String,
        price: Number,
        quantity: Number,
        image: String,
        size: String  // variant size
    }],
    pricing: {
        subtotal: { type: Number, required: true },
        deliveryCharge: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        total: { type: Number, required: true },
        // Reselling Fields
        isResellOrder: { type: Boolean, default: false },
        resellerPrice: { type: Number }, // The price the end customer pays
        margin: { type: Number } // resellerPrice - total
    },
    deliveryAddress: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        addressLine1: { type: String, required: true },
        addressLine2: String,
        landmark: String,
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        addressType: { type: String, default: 'home' }
    },
    paymentMethod: {
        type: {
            type: String,
            enum: ['cod', 'upi', 'card', 'online'],
            default: 'cod'
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending'
        }
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
        default: 'pending'
    },
    statusHistory: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String
    }],
    expectedDelivery: Date,
    actualDelivery: Date,
    cancellation: {
        isCancelled: { type: Boolean, default: false },
        reason: String,
        cancelledBy: String,
        cancelledAt: Date
    },
    returnRequest: {
        isRequested: { type: Boolean, default: false },
        reason: String,
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
        requestedAt: Date,
        adminComment: String,
        rejectionReason: String,
        images: [String], // Array of image URLs
        video: String,    // Video URL
        // Return Logistics
        pickupStatus: {
            type: String,
            enum: ['pending', 'scheduled', 'out_for_pickup', 'picked_up', 'in_transit', 'received_by_seller'],
            default: 'pending'
        },
        pickupDate: Date,
        shiprocketReturn: {
            orderId: Number,      // Return Order ID from Shiprocket
            shipmentId: Number,   // Return Shipment ID
            awbCode: String,
            trackingUrl: String,
            courierName: String
        }
    },
    shiprocket: {
        orderId: Number,      // Shiprocket Order ID
        shipmentId: Number,   // Shiprocket Shipment ID
        awbCode: String,      // AWB Number
        courierName: String,  // Courier Company Name
        trackingUrl: String,  // Tracking Link
        labelUrl: String,     // Shipping Label URL
        pickupScheduled: { type: Boolean, default: false },
        manifestUrl: String,
        etd: Date             // Estimated Time of Delivery from Shiprocket
    }
}, {
    timestamps: true
});

// Generate order number before validation
// Generate order number before validation
orderSchema.pre('validate', async function () {
    if (!this.orderNumber) {
        // Use this.constructor if available, or fetch strictly if needed.
        // In Mongoose, this.constructor refers to the Model.
        const count = await this.constructor.countDocuments();
        this.orderNumber = `ORD${String(count + 1).padStart(6, '0')}`;
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
