const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// This handles: POST http://localhost:3000/orders/checkout
router.post('/checkout', async (req, res) => {
    try {
        // req.body will contain all the fields sent from your checkout form
        const newOrder = new Order(req.body);
        
        const savedOrder = await newOrder.save();
        res.status(201).json({
            message: "Order data stored in MongoDB successfully!",
            orderId: savedOrder._id
        });
    } catch (err) {
        // If a required field (like email) is missing, this sends the error back
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;