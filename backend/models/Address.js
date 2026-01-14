const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true // Explicitly defining to be sure, or just leave it?
    },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true }, // House No, Building
    addressLine2: { type: String }, // Area, Colony, Street 2
    landmark: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    type: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
    isDefault: { type: Boolean, default: false }
}, {
    timestamps: true
});



const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
