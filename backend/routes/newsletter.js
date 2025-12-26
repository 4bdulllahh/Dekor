const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter'); // Make sure this path is correct

// This handles the POST request you just wrote in script.js
router.post('/subscribe', async (req, res) => {
    try {
        const { name, email } = req.body;
        
        // Save to the collection in Atlas
        const newSubscriber = new Newsletter({ name, email });
        await newSubscriber.save();
        
        res.status(201).json({ message: "Thanks for subscribing!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

// ADD THIS: Get all messages
router.get('/all', async (req, res) => {
    const contacts = await Contact.find().sort({ sentAt: -1 });
    res.json(contacts);
});

// ADD THIS: Delete a message
router.delete('/delete/:id', async (req, res) => {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});