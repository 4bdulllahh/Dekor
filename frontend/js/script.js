// Function for the Newsletter Form
async function handleNewsletter(event) {
    event.preventDefault(); // Stops the page from refreshing

    const data = {
        name: document.getElementById('newsletter-name').value,
        email: document.getElementById('newsletter-email').value
    };

    const response = await fetch('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        alert("Thanks for subscribing!");
    }
}

// Function for the Checkout Form
async function handleCheckout(event) {
    event.preventDefault();

    const formData = {
        firstName: document.getElementById('fName').value,
        lastName: document.getElementById('lName').value,
        email: document.getElementById('email').value,
        addressStreet: document.getElementById('street').value,
        // ... add the rest of your checkout fields here
    };

    const response = await fetch('http://localhost:3000/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });

    const result = await response.json();
    console.log(result);
}