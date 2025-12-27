const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    sentAt: { type: Date, default: Date.now }
});

// This will save to a collection named 'contacts' in database

module.exports = mongoose.model('Contact', contactSchema);