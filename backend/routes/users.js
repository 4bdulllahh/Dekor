const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Imports the blueprint

// ROUTE: Get all users (GET http://localhost:3000/users)
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ROUTE: Add a new user (POST http://localhost:3000/users/add)
router.post('/add', async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;

//Get all messages
router.get('/all', async (req, res) => {
    const contacts = await Contact.find().sort({ sentAt: -1 });
    res.json(contacts);
});

//Delete a message
router.delete('/delete/:id', async (req, res) => {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});