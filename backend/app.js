require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // 1. Added CORS

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // 2. Enable CORS for your frontend
app.use(bodyParser.json());

// MongoDB connection
const atlasUri = "mongodb+srv://abdullahbsu823_db_user:vxBxxNzCSFn4ATie@cluster0.i9d8ejy.mongodb.net/K-Sports?retryWrites=true&w=majority"; 
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

app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});