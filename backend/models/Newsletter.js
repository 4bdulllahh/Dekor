const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subscribedAt: { type: Date, default: Date.now }
});

// This will save to a collection named 'newsletters' in your K-Sports database
module.exports = mongoose.model('Newsletter', newsletterSchema);