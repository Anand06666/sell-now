const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false // Optional initially
    },
    role: {
        type: String,
        enum: ['buyer', 'seller', 'admin'],
        default: 'buyer'
    },
    profile_image: {
        type: String,
        required: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    // Seller Approval Fields
    isApproved: {
        type: Boolean,
        default: function () {
            return this.role === 'seller' ? false : true;
        }
    },
    approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: function () {
            return this.role === 'seller' ? 'pending' : 'approved';
        }
    },
    rejectionReason: {
        type: String,
        default: ''
    },
    // Bank Details for Payouts
    bankDetails: {
        accountName: { type: String, default: '' },
        accountNumber: { type: String, default: '' },
        ifscCode: { type: String, default: '' },
        bankName: { type: String, default: '' }
    },
    approvedAt: {
        type: Date,
        required: false
    },
    // KYC / Identification Details
    aadharNumber: {
        type: String,
        required: false
    },
    idProofFront: {
        type: String, // URL to image
        required: false
    },
    idProofBack: {
        type: String, // URL to image
        required: false
    },
    shopPhoto: {
        type: String, // URL to image
        required: false
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    resetPasswordToken: {
        type: String,
        required: false
    },
    resetPasswordExpires: {
        type: Date,
        required: false
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
