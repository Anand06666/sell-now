const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure Local Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Ensure this directory exists
    },
    filename: function (req, file, cb) {
        cb(null, 'product-' + Date.now() + path.extname(file.originalname));
    }
});

const uploadImages = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit for images
});

const uploadVideo = multer({
    storage: storage,
    limits: { fileSize: 200 * 1024 * 1024 } // 200MB limit for videos
});

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
router.post('/multiple', uploadImages.array('images', 5), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).send('No files uploaded.');
        }
        const fileUrls = req.files.map(file => {
            const protocol = req.protocol;
            const host = req.get('host');
            return `${protocol}://${host}/uploads/${file.filename}`;
        });
        res.json(fileUrls);
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).send('Server Error during upload.');
    }
});

// @desc    Upload single video
// @route   POST /api/upload/video
router.post('/video', uploadVideo.single('video'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No video uploaded.');
        }
        const protocol = req.protocol;
        const host = req.get('host');
        const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
        res.json({ url: fileUrl });
    } catch (error) {
        console.error('Video Upload Error:', error);
        res.status(500).send('Server Error during upload.');
    }
});

module.exports = router;
