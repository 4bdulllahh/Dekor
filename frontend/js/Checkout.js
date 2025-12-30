// checkout system
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the checkout page by looking for the order table
    const isCheckoutPage = document.querySelector('.site-block-order-table');
    
    if (!isCheckoutPage) return;

    // Small delay to ensure the cart data is accessible
    setTimeout(() => {
        initCheckout();
    }, 100);
});

function initCheckout() {
    // Pull data from localStorage (same key used in cart.js)
    const cartData = localStorage.getItem('furniCart');
    const items = cartData ? JSON.parse(cartData) : [];
    
    console.log('Checkout data detected:', items); 

    if (items.length === 0) {
        showEmptyCartMessage();
        return;
    }

    // Initialize UI
    updateOrderTable(items);
    displayCheckoutItems(items);
    
    // Attach the Place Order event listener
    const placeOrderBtn = document.querySelector('.btn-black.btn-lg.py-3.btn-block');
    if (placeOrderBtn) {
        // We use an anonymous function to pass 'items' to the handler
        placeOrderBtn.addEventListener('click', (e) => handlePlaceOrder(e, items));
    }
}

// 1. RENDER THE ORDER SUMMARY TABLE
function updateOrderTable(items) {
    const orderTableBody = document.getElementById('checkout-order-body') || 
                           document.querySelector('.site-block-order-table tbody');
    
    if (!orderTableBody) return;

    orderTableBody.innerHTML = ''; 
    let subtotal = 0;

    items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name} <strong class="mx-2">x</strong> ${item.quantity}</td>
            <td>$${itemTotal.toFixed(2)}</td>
        `;
        orderTableBody.appendChild(row);
    });

    const totals = `
        <tr>
            <td class="text-black font-weight-bold"><strong>Cart Subtotal</strong></td>
            <td class="text-black">$${subtotal.toFixed(2)}</td>
        </tr>
        <tr>
            <td class="text-black font-weight-bold"><strong>Order Total</strong></td>
            <td class="text-black font-weight-bold"><strong>$${subtotal.toFixed(2)}</strong></td>
        </tr>
    `;
    orderTableBody.insertAdjacentHTML('beforeend', totals);
}

// 2. DISPLAY VISUAL PRODUCT LIST IN BILLING SECTION
function displayCheckoutItems(items) {
    const billingSection = document.querySelector('.col-md-6.mb-5.mb-md-0');
    if (!billingSection || document.querySelector('.checkout-cart-items')) return;

    const itemsDisplay = document.createElement('div');
    itemsDisplay.className = 'checkout-cart-items mb-4';
    
    let itemsHTML = `
        <h3 class="h5 mb-3 text-black font-weight-bold">Your Items (${items.length})</h3>
        <div class="checkout-items-list">
    `;

    items.forEach(item => {

        const checkoutImage = item.image.startsWith('../') ? item.image : '../' + item.image.replace('./', '');
        
        itemsHTML += `
            <div class="checkout-item d-flex align-items-center mb-2 p-2 border rounded bg-light">
                <div class="checkout-item-image me-3">
                    <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;">
                </div>
                <div class="checkout-item-info">
                    <h6 class="mb-0">${item.name}</h6>
                    <small>Qty: ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</small>
                </div>
            </div>
        `;
    });

    itemsHTML += `</div>`;
    itemsDisplay.innerHTML = itemsHTML;
    billingSection.insertBefore(itemsDisplay, billingSection.firstChild);
}

// 3. THE MASTER ORDER SUBMISSION HANDLER
async function handlePlaceOrder(e, items) {
    e.preventDefault();

    // Gather form data using your HTML IDs
    const orderData = {
        firstName: document.getElementById('c_fname').value,
        lastName: document.getElementById('c_lname').value,
        country: document.getElementById('c_country').value,
        addressStreet: document.getElementById('c_address').value,
        apartment: document.getElementById('c_apartment').value,
        state: document.getElementById('c_state_country').value,
        postalZip: document.getElementById('c_postal_zip').value,
        email: document.getElementById('c_email_address').value,
        phone: document.getElementById('c_phone').value,
        companyName: document.getElementById('c_companyname').value,
        orderNote: document.getElementById('c_order_notes').value,
        // Cart data
        cartItems: items, 
        totalAmount: items.reduce((sum, i) => sum + (i.price * i.quantity), 0)
    };

    // Validation
    if (!orderData.firstName || !orderData.email || !orderData.addressStreet) {
        alert("Please fill in all required fields marked with (*)");
        return;
    }

    const submitBtn = e.target;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Processing...";
    submitBtn.disabled = true;

    try {
        const response = await fetch('https://dekor-kwrk.onrender.com/orders/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        if (response.ok) {
            alert("Order placed successfully! Your Order ID is: " + result.orderId);
            localStorage.removeItem('furniCart'); // Clear cart memory
            window.location.href = 'thankyou.html'; 
        } else {
            alert("Order failed: " + (result.error || "Unknown server error"));
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    } catch (err) {
        console.error("Checkout Error:", err);
        alert("Could not connect to the live server. Please check your internet.");
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// 4. EMPTY CART UI
function showEmptyCartMessage() {
    const container = document.querySelector('.untree_co-section .container');
    if (container) {
        container.innerHTML = `
            <div class="row text-center py-5">
                <div class="col-12" style="padding: 60px 20px;">
                    <i class="fa fa-shopping-cart" style="font-size: 80px; color: #d0d0d0; margin-bottom: 20px;"></i>
                    <h2 class="mb-3">Your Cart is Empty</h2>
                    <p class="mb-4" style="color: #6a6a6a;">Add some items to your cart before checking out.</p>
                    <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
                </div>
            </div>
        `;
    }
}