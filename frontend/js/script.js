// 1. Newsletter Form Function
async function handleNewsletter(event) {
    event.preventDefault();

    const data = {
        name: document.getElementById('newsletter-name').value,
        email: document.getElementById('newsletter-email').value
    };

    // Updated URL to match your app.js (removed /api)
    const response = await fetch('http://localhost:3000/newsletter/subscribe', {
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

    const response = await fetch('http://localhost:3000/contact/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        alert("Message sent successfully!");
        event.target.reset();
    }
}

// 3. Full Checkout Form Function
async function handleCheckout(event) {
    event.preventDefault();

    // Make sure these IDs match your HTML input IDs exactly!
    const formData = {
        firstName: document.getElementById('fName').value,
        lastName: document.getElementById('lName').value,
        country: document.getElementById('country').value,
        companyName: document.getElementById('company').value, // Optional
        addressStreet: document.getElementById('street').value,
        apartment: document.getElementById('apartment').value, // Optional
        state: document.getElementById('state').value,
        postalZip: { type: String, required: true },
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        orderNote: document.getElementById('note').value      // Optional
    };

    const response = await fetch('http://localhost:3000/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });

    if (response.ok) {
        const result = await response.json();
        alert("Order placed successfully! Order ID: " + result.orderId);
        window.location.href = "thank-you.html"; // Optional redirect
    } else {
        alert("Something went wrong with the checkout.");
    }
}