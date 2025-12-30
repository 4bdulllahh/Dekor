require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // 1. Added CORS

const app = express();
const port = process.env.PORT || 3000;

// Middleware
// Enable CORS for your specific Vercel domain
app.use(cors({
    origin: ['https://dekorfurniture.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
})); // 2. Enable CORS for your frontend
app.use(bodyParser.json());
app.use('/auth', authRoutes); // 3. Auth routes

// MongoDB connection
const atlasUri = process.env.MONGO_URI;
// Added "K-Sports" to the URI above so your data goes into a specific database name

mongoose.connect(atlasUri)
    .then(() => console.log(' Connected to MongoDB Atlas!'))
    .catch(err => console.error(' Atlas connection error:', err));

// Import Routes
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const newsletterRoutes = require('./routes/newsletter');
const contactRoutes = require('./routes/contacts');

// Connect URLs to the routes
app.use('/users', userRoutes);           // http://localhost:3000/users/add
app.use('/orders', orderRoutes);         // http://localhost:3000/orders/checkout
app.use('/newsletter', newsletterRoutes); // http://localhost:3000/newsletter/subscribe
app.use('/contact', contactRoutes);       // http://localhost:3000/contact/send

app.post('/admin/verify', (req, res) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: "Invalid Password" });
    }
});

app.listen(port, () => {    
    console.log(`Server running on http://localhost:${port}`);
});


