const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact'); // Ensure this matches your model file

// This handles: http://localhost:3000/contact/send
router.post('/send', async (req, res) => {
    try {
        const { firstName, lastName, email, message } = req.body;
        
        const newContact = new Contact({
            firstName,
            lastName,
            email,
            message
        });

        await newContact.save();
        res.status(201).json({ message: "We received your message!" });
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