const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');

router.post('/subscribe', async (req, res) => {
    try {
        const entry = new Newsletter(req.body);
        await entry.save();
        res.status(201).json({ message: "Subscribed successfully!" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;