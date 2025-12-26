const express = require('express');
const router = express.Router();
const User = require('../models/user');

// 1. SIGNUP: http://localhost:3000/auth/signup
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

// 2. LOGIN: http://localhost:3000/auth/login
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

// 3. ADMIN VERIFY: http://localhost:3000/auth/admin/verify
router.post('/admin/verify', (req, res) => {
    const { password } = req.body;
    const secretPassword = "dekor2025"; // Your chosen password

    if (password === secretPassword) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: "Invalid Secret Password" });
    }
});

// 4. GET ALL USERS (For Admin Dashboard): http://localhost:3000/auth/all
router.get('/all', async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Don't send passwords to the dashboard
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. DELETE USER (For Admin Dashboard): http://localhost:3000/auth/delete/:id
router.delete('/delete/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;