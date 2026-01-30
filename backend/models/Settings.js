const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    earnWithUsLink: {
        type: String,
        required: true,
        default: 'https://play.google.com/store' // Default fallback
    }
}, {
    timestamps: true
});

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
