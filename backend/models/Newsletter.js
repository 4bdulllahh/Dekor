const mongoose = require('mongoose');

const NewsletterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    signedUpAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Newsletter', NewsletterSchema);