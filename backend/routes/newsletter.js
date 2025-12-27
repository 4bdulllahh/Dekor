const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');

// 1. Subscribe: POST http://localhost:3000/newsletter/subscribe
router.post('/subscribe', async (req, res) => {
    try {
        const { name, email } = req.body;
        const newSubscriber = new Newsletter({ name, email });
        await newSubscriber.save();
        res.status(201).json({ message: "Thanks for subscribing!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Get All Subscribers: GET http://localhost:3000/newsletter/all
router.get('/all', async (req, res) => {
    try {
        const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
        res.json(subscribers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Delete Subscriber: DELETE http://localhost:3000/newsletter/delete/:id
router.delete('/delete/:id', async (req, res) => {
    try {
        await Newsletter.findByIdAndDelete(req.params.id);
        res.json({ message: "Subscriber removed" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; 