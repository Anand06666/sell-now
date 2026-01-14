const User = require('../models/User');

// @desc    Get all pending sellers
// @route   GET /api/admin/sellers/pending
// @access  Private/Admin
const getPendingSellers = async (req, res) => {
    try {
        const sellers = await User.find({
            role: 'seller',
            approvalStatus: 'pending'
        }).select('-password').sort({ created_at: -1 });

        res.json(sellers);
    } catch (error) {
        console.error('Get Pending Sellers Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all sellers with approval status
// @route   GET /api/admin/sellers/all
// @access  Private/Admin
const getAllSellersWithStatus = async (req, res) => {
    try {
        const { status } = req.query; // pending, approved, rejected

        const filter = { role: 'seller' };
        if (status) {
            filter.approvalStatus = status;
        }

        const sellers = await User.find(filter)
            .select('-password')
            .populate('approvedBy', 'name email')
            .sort({ created_at: -1 });

        res.json(sellers);
    } catch (error) {
        console.error('Get All Sellers Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve seller
// @route   PUT /api/admin/sellers/:id/approve
// @access  Private/Admin
const approveSeller = async (req, res) => {
    try {
        const seller = await User.findById(req.params.id);

        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        if (seller.role !== 'seller') {
            return res.status(400).json({ message: 'User is not a seller' });
        }

        seller.isApproved = true;
        seller.approvalStatus = 'approved';
        seller.approvedAt = new Date();
        seller.approvedBy = req.user._id;
        seller.rejectionReason = undefined; // Clear any previous rejection reason

        await seller.save();

        res.json({
            message: 'Seller approved successfully',
            seller: {
                _id: seller._id,
                name: seller.name,
                email: seller.email,
                approvalStatus: seller.approvalStatus,
                approvedAt: seller.approvedAt
            }
        });
    } catch (error) {
        console.error('Approve Seller Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reject seller
// @route   PUT /api/admin/sellers/:id/reject
// @access  Private/Admin
const rejectSeller = async (req, res) => {
    try {
        const { rejectionReason } = req.body;

        if (!rejectionReason) {
            return res.status(400).json({ message: 'Rejection reason is required' });
        }

        const seller = await User.findById(req.params.id);

        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        if (seller.role !== 'seller') {
            return res.status(400).json({ message: 'User is not a seller' });
        }

        seller.isApproved = false;
        seller.approvalStatus = 'rejected';
        seller.rejectionReason = rejectionReason;
        seller.approvedAt = undefined;
        seller.approvedBy = undefined;

        await seller.save();

        res.json({
            message: 'Seller rejected successfully',
            seller: {
                _id: seller._id,
                name: seller.name,
                email: seller.email,
                approvalStatus: seller.approvalStatus,
                rejectionReason: seller.rejectionReason
            }
        });
    } catch (error) {
        console.error('Reject Seller Error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPendingSellers,
    getAllSellersWithStatus,
    approveSeller,
    rejectSeller
};
