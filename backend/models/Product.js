const mongoose = require('mongoose');

const variantSchema = mongoose.Schema({
    // Dynamic attributes - seller defines these
    attributes: {
        type: Map,
        of: String
        // Examples:
        // { size: 'L', color: 'Red' }
        // { storage: '256GB', color: 'Black' }
        // { voltage: '220V', wattage: '1000W' }
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    sku: String,  // Unique SKU for this variant
    images: [String]  // Variant-specific images (optional)
}, { _id: true });

const productSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subcategory: { type: String },

    // Base price (for display, actual price from variants or direct)
    // Also supports old 'price' field for backward compatibility
    basePrice: { type: Number },
    price: { type: Number },  // Legacy field for backward compatibility
    mrp: { type: Number },    // Maximum Retail Price (optional)

    // Product type
    hasVariants: {
        type: Boolean,
        default: false
    },

    // Variant configuration - what attributes this product has
    variantConfig: {
        enabled: { type: Boolean, default: false },
        attributes: [{
            name: String,      // e.g., "Size", "Color", "Storage"
            values: [String]   // e.g., ["S", "M", "L", "XL"]
        }]
        // Example for T-Shirt:
        // attributes: [
        //   { name: "Size", values: ["S", "M", "L", "XL"] },
        //   { name: "Color", values: ["Red", "Blue", "Black"] }
        // ]
    },

    // Actual variants (combinations of attributes)
    variants: [variantSchema],

    // For products WITHOUT variants (simple products)
    stock: {
        type: Number,
        default: 0,
        min: 0
    },

    condition: { type: String, required: true },
    images: [{ type: String }],

    // Category-specific attributes (flexible for different product types)
    attributes: {
        type: Map,
        of: String,
        default: {}
    },

    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'sold', 'pending_approval', 'rejected'],
        default: 'pending_approval'
    },

    // Rating fields
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalReviews: {
        type: Number,
        default: 0
    },

    // Dynamic Shipping
    shippingCost: {
        type: Number,
        default: 40, // Default standard shipping
        min: 0
    },

    // Return Policy
    returnPolicy: {
        type: String,
        enum: ['return', 'replacement', 'no_return'],
        default: 'return'
    },
    returnWindow: {
        type: Number,
        default: 7 // Default 7 days
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual field for display price
productSchema.virtual('displayPrice').get(function () {
    // For variant products, return lowest variant price
    if (this.hasVariants && this.variants && this.variants.length > 0) {
        const prices = this.variants.map(v => v.price).filter(p => p > 0);
        return prices.length > 0 ? Math.min(...prices) : 0;
    }
    // For simple products, return price or basePrice
    return this.price || this.basePrice || 0;
});

// Index for search
productSchema.index({ title: 'text', description: 'text' });
// Performance Indexes
productSchema.index({ status: 1, createdAt: -1 }); // Home screen default sort
productSchema.index({ category: 1, status: 1 });   // Category filter
productSchema.index({ status: 1, basePrice: 1 });  // Price sort

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
