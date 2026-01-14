const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getAllUsers } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const { getAddresses, addAddress, updateAddress, deleteAddress } = require('../controllers/addressController');

router.route('/').get(protect, admin, getAllUsers);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/address').get(protect, getAddresses).post(protect, addAddress);
router.route('/address/:id').put(protect, updateAddress).delete(protect, deleteAddress);

module.exports = router;
