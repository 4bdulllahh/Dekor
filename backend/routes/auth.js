const express = require('express');
const router = express.Router();
const User = require('../models/user');

// SIGNUP: http://localhost:3000/auth/signup
router.post('/signup', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        const newUser = new User({ fullName, email, password });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// LOGIN: http://localhost:3000/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        res.status(200).json({ 
            message: "Login successful!", 
            user: { name: user.fullName, email: user.email } 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; 