// ==================== AUTH SYSTEM ====================

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', function() {
  checkAuthStatus();
  initAuthForms();
  initUserDropdown();
});

// ==================== AUTH STATUS ====================
function checkAuthStatus() {
  const user = getLoggedInUser();
  
  if (user) {
    console.log('User logged in:', user.name);
  } else {
    console.log('No user logged in');
  }
}

// Get logged in user from localStorage
function getLoggedInUser() {
  const userStr = localStorage.getItem('dekorUser');
  return userStr ? JSON.parse(userStr) : null;
}

// Save user to localStorage
function saveUser(userData) {
  localStorage.setItem('dekorUser', JSON.stringify(userData));
}

// Remove user from localStorage
function logoutUser() {
  localStorage.removeItem('dekorUser');
}

// ==================== FORM SWITCHING ====================
function switchToSignup() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('signupForm').style.display = 'block';
}

function switchToLogin() {
  document.getElementById('signupForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
}

// ==================== PASSWORD TOGGLE ====================
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const button = input.parentElement.querySelector('.password-toggle');
  const icon = button.querySelector('i');
  
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
}

// ==================== FORM INITIALIZATION ====================
function initAuthForms() {
  // Login Form
  const loginForm = document.getElementById('loginFormElement');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Signup Form
  const signupForm = document.getElementById('signupFormElement');
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }
}

// ==================== LOGIN HANDLER ====================
async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const rememberMe = document.getElementById('rememberMe').checked;
  
  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.classList.add('btn-loading');
  submitBtn.textContent = '';
  
  // Remove any existing alerts
  removeAlerts();
  
  try {
    // Here you would normally make an API call to your backend
    // For now, we'll simulate it with a timeout
    await simulateAPICall(1000);
    
    // For demonstration, we'll check against a mock user
    // In production, this would be handled by your backend
    const mockUser = {
      name: 'John Doe',
      email: email,
      avatar: 'JD'
    };
    
    // Validate credentials (in production, this is done server-side)
    if (email && password.length >= 6) {
      // Save user data
      saveUser(mockUser);
      
      // Show success message
      showAlert('success', 'Login successful! Redirecting...', loginForm);
      
      // Redirect to home page after short delay
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    } else {
      throw new Error('Invalid credentials');
    }
    
  } catch (error) {
    // Show error message
    showAlert('error', 'Invalid email or password. Please try again.', loginForm);
    
    // Reset button
    submitBtn.classList.remove('btn-loading');
    submitBtn.textContent = 'Login';
  }
}

// ==================== SIGNUP HANDLER ====================
async function handleSignup(e) {
  e.preventDefault();
  
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;
  const agreeTerms = document.getElementById('agreeTerms').checked;
  
  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.classList.add('btn-loading');
  submitBtn.textContent = '';
  
  // Remove any existing alerts
  removeAlerts();
  
  // Validation
  if (password !== confirmPassword) {
    showAlert('error', 'Passwords do not match!', e.target);
    submitBtn.classList.remove('btn-loading');
    submitBtn.textContent = 'Sign Up';
    return;
  }
  
  if (password.length < 8) {
    showAlert('error', 'Password must be at least 8 characters long!', e.target);
    submitBtn.classList.remove('btn-loading');
    submitBtn.textContent = 'Sign Up';
    return;
  }
  
  if (!agreeTerms) {
    showAlert('error', 'Please agree to the Terms & Conditions!', e.target);
    submitBtn.classList.remove('btn-loading');
    submitBtn.textContent = 'Sign Up';
    return;
  }
  
  try {
    // Here you would make an API call to your MongoDB backend
    // Example endpoint: POST /api/auth/signup
    
    // For now, we'll simulate it
    await simulateAPICall(1500);
    
    // Create user object for MongoDB
    const userData = {
      name: name,
      email: email,
      password: password, // In production, this should be hashed on the backend
      createdAt: new Date().toISOString()
    };
    
    // Simulate successful signup
    // In production, you would send this to your backend:
    /*
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error('Signup failed');
    }
    
    const result = await response.json();
    */
    
    // For demo purposes, save to localStorage
    const userProfile = {
      name: name,
      email: email,
      avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    };
    
    saveUser(userProfile);
    
    // Show success message
    showAlert('success', 'Account created successfully! Redirecting...', e.target);
    
    // Redirect to home page
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
    
  } catch (error) {
    // Show error message
    showAlert('error', 'Signup failed. Please try again.', e.target);
    
    // Reset button
    submitBtn.classList.remove('btn-loading');
    submitBtn.textContent = 'Sign Up';
  }
}

// ==================== USER DROPDOWN ====================
function initUserDropdown() {
  // This function is called on all pages to initialize the dropdown
  const userIcon = document.querySelector('.custom-navbar-cta li a[href*="user"]');
  
  if (!userIcon) return;
  
  const dropdownWrapper = userIcon.parentElement;
  const user = getLoggedInUser();
  
  // Create dropdown HTML
  let dropdownHTML;
  
  if (user) {
    // Logged in state
    dropdownHTML = `
      <div class="user-dropdown" id="userDropdown">
        <div class="user-dropdown-profile">
          <div class="user-profile-info">
            <div class="user-avatar">${user.avatar}</div>
            <div class="user-details">
              <p class="user-name">${user.name}</p>
              <p class="user-email">${user.email}</p>
            </div>
          </div>
        </div>
        <div class="user-dropdown-menu">
          <a href="#" class="user-dropdown-item">
            <i class="fas fa-user"></i>
            <span>My Profile</span>
          </a>
          <a href="#" class="user-dropdown-item">
            <i class="fas fa-shopping-bag"></i>
            <span>My Orders</span>
          </a>
          <a href="#" class="user-dropdown-item">
            <i class="fas fa-heart"></i>
            <span>Wishlist</span>
          </a>
          <a href="#" class="user-dropdown-item">
            <i class="fas fa-cog"></i>
            <span>Settings</span>
          </a>
          <div class="user-dropdown-divider"></div>
          <a href="#" class="user-dropdown-item logout" onclick="handleLogout(event)">
            <i class="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </a>
        </div>
      </div>
    `;
  } else {
    // Logged out state
    dropdownHTML = `
      <div class="user-dropdown" id="userDropdown">
        <div class="user-dropdown-guest">
          <h4>Welcome!</h4>
          <p>Sign in to access your account and track your orders</p>
          <div class="user-dropdown-actions">
            <a href="auth.html" class="btn-dropdown btn-dropdown-primary">Login</a>
            <a href="auth.html" class="btn-dropdown btn-dropdown-outline" onclick="window.showSignup = true">Sign Up</a>
          </div>
        </div>
      </div>
    `;
  }
  
  // Insert dropdown
  dropdownWrapper.insertAdjacentHTML('beforeend', dropdownHTML);
  
  const dropdown = document.getElementById('userDropdown');
  
  // Toggle dropdown on click
  userIcon.addEventListener('click', function(e) {
    e.preventDefault();
    dropdown.classList.toggle('show');
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!dropdownWrapper.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });
  
  // Check if we need to show signup form
  if (window.location.pathname.includes('auth.html') && window.showSignup) {
    switchToSignup();
    window.showSignup = false;
  }
}

// ==================== LOGOUT HANDLER ====================
function handleLogout(e) {
  e.preventDefault();
  
  // Remove user data
  logoutUser();
  
  // Redirect to home page
  window.location.href = 'index.html';
}

// ==================== UTILITY FUNCTIONS ====================
function simulateAPICall(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function showAlert(type, message, form) {
  const alertHTML = `
    <div class="auth-alert auth-alert-${type}">
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      ${message}
    </div>
  `;
  
  form.insertAdjacentHTML('afterbegin', alertHTML);
}

function removeAlerts() {
  const alerts = document.querySelectorAll('.auth-alert');
  alerts.forEach(alert => alert.remove());
}

// ==================== MONGODB INTEGRATION GUIDE ====================
/*
To connect this to MongoDB:

1. Backend Setup (Node.js + Express example):

// Install dependencies
npm install express mongoose bcryptjs jsonwebtoken

// Create user model (models/User.js)
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

// Create auth routes (routes/auth.js)
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    user = new User({
      name,
      email,
      password: hashedPassword
    });
    
    await user.save();
    
    // Create token
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
      expiresIn: '7d'
    });
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create token
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
      expiresIn: '7d'
    });
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

2. Frontend Integration:

// Update handleSignup function
async function handleSignup(e) {
  e.preventDefault();
  
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  
  try {
    const response = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message);
    }
    
    // Save token and user data
    localStorage.setItem('dekorToken', data.token);
    saveUser({
      name: data.user.name,
      email: data.user.email,
      avatar: data.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    });
    
    window.location.href = 'index.html';
  } catch (error) {
    showAlert('error', error.message, e.target);
  }
}

// Update handleLogin function similarly
*/