const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

router.post('/send', async (req, res) => {
    try {
        const newMessage = new Contact(req.body);
        await newMessage.save();
        res.status(201).json({ message: "Message sent!" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;