// 1. Newsletter Form Function
async function handleNewsletter(event) {
    event.preventDefault();

    const data = {
        name: document.getElementById('newsletter-name').value,
        email: document.getElementById('newsletter-email').value
    };

    // Updated URL to match your app.js (removed /api)
    const response = await fetch('https://dekor-kwrk.onrender.com/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        alert("Thanks for subscribing!");
        event.target.reset(); // Clears the form
    }
}

// 2. Contact Us Form Function
async function handleContact(event) {
    event.preventDefault();

    const data = {
        firstName: document.getElementById('contact-fname').value,
        lastName: document.getElementById('contact-lname').value,
        email: document.getElementById('contact-email').value,
        message: document.getElementById('contact-message').value
    };

    const response = await fetch('https://dekor-kwrk.onrender.com/contact/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        alert("Message sent successfully!");
        event.target.reset();
    }
}



async function handleNewsletterSubscription(event) {
    event.preventDefault();
    
    // Grabbing the name and email from the form inputs
    const name = event.target.querySelector('input[placeholder*="name"]').value;
    const email = event.target.querySelector('input[placeholder*="email"]').value;

    try {
        const response = await fetch('https://dekor-kwrk.onrender.com/newsletter/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
        });

        const data = await response.json();
        
        if (response.ok) {
            alert(data.message);
            event.target.reset(); // Clears the form after success
        } else {
            alert("Error: " + data.error);
        }
    } catch (error) {
        console.error("Newsletter error:", error);
        alert("Could not connect to the server.");
    }
}

// Attach the function to your newsletter form
document.addEventListener('DOMContentLoaded', () => {
    const newsletterForm = document.querySelector('.subscription-form form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubscription);
    }
});

async function handleContactSubmit(event) {
    event.preventDefault();

    const contactData = {
        firstName: document.getElementById('fname').value,
        lastName: document.getElementById('lname').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    try {
        const response = await fetch('https://dekor-kwrk.onrender.com/contact/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData)
        });

        const result = await response.json();

        if (response.ok) {
            alert("Message sent successfully!");
            event.target.reset(); // Clears the form
        } else {
            alert("Error: " + result.error);
        }
    } catch (err) {
        console.error("Contact Error:", err);
        alert("Could not connect to server.");
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
});