const Category = require('../models/Category');

// @desc    Get all categories with subcategories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({}).sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        console.error('getCategories Error:', error);

        const fs = require('fs');
        const debugPath = require('path').join(__dirname, '..', 'logs', 'debug_categories.txt');
        fs.appendFileSync(debugPath, `\n[${new Date().toISOString()}] GET CATEGORIES ERROR: ${error.message}\nSTACK: ${error.stack}\n`);

        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
    try {
        const { name, image } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const categoryExists = await Category.findOne({ name });
        if (categoryExists) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = await Category.create({ name, image, subcategories: [] });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update category name
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
    try {
        const { name, image } = req.body;
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        category.name = name || category.name;
        category.image = image !== undefined ? image : category.image;
        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await category.deleteOne();
        res.json({ message: 'Category removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add subcategory to category
// @route   POST /api/categories/:id/subcategories
// @access  Private/Admin
const addSubcategory = async (req, res) => {
    try {
        const { name, image } = req.body;
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        if (!name) {
            return res.status(400).json({ message: 'Subcategory name is required' });
        }

        // Check if subcategory already exists
        const exists = category.subcategories.some(sub => sub.name === name);
        if (exists) {
            return res.status(400).json({ message: 'Subcategory already exists' });
        }

        category.subcategories.push({ name, image });
        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update subcategory name
// @route   PUT /api/categories/:id/subcategories/:subId
// @access  Private/Admin
const updateSubcategory = async (req, res) => {
    try {
        const { name, image } = req.body;
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const subcategory = category.subcategories.id(req.params.subId);
        if (!subcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        subcategory.name = name || subcategory.name;
        subcategory.image = image !== undefined ? image : subcategory.image;
        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete subcategory from category
// @route   DELETE /api/categories/:id/subcategories/:subId
// @access  Private/Admin
const deleteSubcategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        category.subcategories.pull(req.params.subId);
        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory
};
