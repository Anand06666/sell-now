const express = require('express');
const router = express.Router();
const {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route
router.route('/').get(getCategories);

// Admin routes
router.route('/').post(protect, admin, createCategory);
router.route('/:id').put(protect, admin, updateCategory).delete(protect, admin, deleteCategory);
router.route('/:id/subcategories').post(protect, admin, addSubcategory);
router.route('/:id/subcategories/:subId').put(protect, admin, updateSubcategory).delete(protect, admin, deleteSubcategory);

module.exports = router;
