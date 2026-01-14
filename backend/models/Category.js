const mongoose = require('mongoose');

const subcategorySchema = mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String } // Added image field
}, { _id: true });

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    image: { type: String }, // Added image field
    subcategories: [subcategorySchema]
}, {
    timestamps: true
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
