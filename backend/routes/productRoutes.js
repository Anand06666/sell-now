const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getMyListings, getAdminProducts, updateProductStatus } = require('../controllers/productController');
const { getFilterOptions } = require('../controllers/filterController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getProducts).post(protect, createProduct);
router.route('/filters').get(getFilterOptions);
// specific routes first
router.route('/mylistings').get(protect, getMyListings);
router.route('/admin').get(protect, admin, getAdminProducts);

// generic ID routes last
router.route('/:id/status').put(protect, admin, updateProductStatus);
router.route('/:id')
    .get(getProductById)
    .put(protect, updateProduct)
    .delete(protect, deleteProduct);

module.exports = router;
