const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Send Message
router.post('/send', async (req, res) => {
    try {
        const newContact = new Contact(req.body);
        await newContact.save();
        res.status(201).json({ message: "Message sent!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All (For Admin)
router.get('/all', async (req, res) => {
    const contacts = await Contact.find().sort({ sentAt: -1 });
    res.json(contacts);
});

// Delete (For Admin)
router.delete('/delete/:id', async (req, res) => {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

module.exports = router;