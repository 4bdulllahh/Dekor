// ==================== AUTH SYSTEM INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    initAuthForms();
    checkAuthStatus();
});

function initAuthForms() {
    const loginForm = document.getElementById('loginFormElement');
    const signupForm = document.getElementById('signupFormElement');

    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (signupForm) signupForm.addEventListener('submit', handleSignup);
}

// ==================== LOGIN HANDLER (THE MISSING FUNCTION) ====================
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    submitBtn.textContent = 'Logging in...';
    removeAlerts();

    try {
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Login failed');

        // Success: Save user info and redirect
        const userProfile = {
            name: data.user.name,
            email: data.user.email,
            avatar: data.user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
        };
        
        saveUser(userProfile);
        showAlert('success', 'Login successful! Redirecting...', e.target);
        
        setTimeout(() => { window.location.href = '../index.html'; }, 1500);

    } catch (error) {
        showAlert('error', error.message, e.target);
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
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    removeAlerts();

    if (password !== confirmPassword) {
        showAlert('error', 'Passwords do not match!', e.target);
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName: name, email, password })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Signup failed');

        showAlert('success', 'Account created! Please login.', e.target);
        setTimeout(() => { switchToLogin(); }, 2000);

    } catch (error) {
        showAlert('error', error.message, e.target);
    }
}

// ==================== UI HELPER FUNCTIONS ====================
function switchToSignup() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
}

function switchToLogin() {
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

function saveUser(userData) {
    localStorage.setItem('dekorUser', JSON.stringify(userData));
}

function checkAuthStatus() {
    const user = localStorage.getItem('dekorUser');
    if (user) console.log('User session active:', JSON.parse(user).name);
}

function showAlert(type, message, form) {
    const alertHTML = `<div class="auth-alert alert-${type}">${message}</div>`;
    form.insertAdjacentHTML('afterbegin', alertHTML);
}

function removeAlerts() {
    const alerts = document.querySelectorAll('.auth-alert');
    alerts.forEach(a => a.remove());
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === 'password' ? 'text' : 'password';
}