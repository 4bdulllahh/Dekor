const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    // Name details
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    
    // Location details
    country: { type: String, required: true },
    addressStreet: { type: String, required: true },
    apartment: { type: String }, // Optional
    state: { type: String, required: true },
    postalZip: { type: String, required: true },
    
    // Contact details
    email: { type: String, required: true },
    phone: { type: String, required: true },
    
    // Additional info
    companyName: { type: String }, // Optional
    orderNote: { type: String },   // Optional
    
    // System automatically adds the date
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);