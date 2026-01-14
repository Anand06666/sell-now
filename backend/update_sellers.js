// Script to update existing sellers with approval status
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sellnow');

async function updateExistingSellers() {
    try {
        // Find all sellers without approvalStatus field
        const sellers = await User.find({
            role: 'seller',
            approvalStatus: { $exists: false }
        });

        console.log(`Found ${sellers.length} sellers without approval status`);

        for (const seller of sellers) {
            seller.isApproved = false;
            seller.approvalStatus = 'pending';
            await seller.save();
            console.log(`Updated seller: ${seller.email}`);
        }

        console.log('✅ All sellers updated successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

updateExistingSellers();
