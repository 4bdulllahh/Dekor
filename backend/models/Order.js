const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    country: { type: String, required: true },
    addressStreet: { type: String, required: true },
    apartment: { type: String },
    state: { type: String, required: true },
    postalZip: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    companyName: { type: String },
    orderNote: { type: String },
    cartItems: { type: Array, required: true }, // Stores the list of products
    totalAmount: { type: Number, required: true }, // Stores the final price (e.g., $637.00)
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);