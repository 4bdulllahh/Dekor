const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// 1. Place Order: POST http://localhost:3000/orders/checkout
router.post('/checkout', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).json({
            message: "Order data stored successfully!",
            orderId: savedOrder._id
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 2. Get All Orders: GET http://localhost:3000/orders/all
router.get('/all', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Delete Order: DELETE http://localhost:3000/orders/delete/:id
router.delete('/delete/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: "Order deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; 