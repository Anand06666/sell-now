const Settings = require('../models/Settings');

// @desc    Get global settings (Earn With Us Link)
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            // Create default settings if not exists
            settings = await Settings.create({});
        }
        res.json(settings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update global settings (Earn With Us Link)
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
    try {
        const { earnWithUsLink } = req.body;

        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({ earnWithUsLink });
        } else {
            settings.earnWithUsLink = earnWithUsLink || settings.earnWithUsLink;
            await settings.save();
        }

        res.json(settings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getSettings,
    updateSettings
};
