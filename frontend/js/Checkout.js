// Checkout Page Script - Only runs on checkout page
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on the checkout page
  const isCheckoutPage = document.querySelector('.site-block-order-table');
  
  if (!isCheckoutPage) {
    // Not on checkout page, don't run anything
    return;
  }

  // Wait a bit to ensure cart.js is loaded
  setTimeout(() => {
    initCheckout();
  }, 100);
});

function initCheckout() {
  // Pull data from the same key used in cart.js
  const cartData = localStorage.getItem('furniCart');
  const items = cartData ? JSON.parse(cartData) : [];
  
  console.log('Checkout data detected:', items); 

  if (items.length === 0) {
    showEmptyCartMessage();
    return;
  }

  // Pass items directly to the table and order handler
  updateOrderTable(items);
  displayCheckoutItems(items);
  handlePlaceOrder(items);
}

function updateOrderTable(items) {
  const orderTableBody = document.getElementById('checkout-order-body');
  
  if (!orderTableBody) {
    // If the ID isn't found, try the fallback class name
    const fallback = document.querySelector('.site-block-order-table tbody');
    if (fallback) {
       console.log('Using fallback selector');
       renderRows(fallback, items);
    }
    return;
  }

  renderRows(orderTableBody, items);
}

function renderRows(container, items) {
  container.innerHTML = ''; // Wipe T-shirts
  let subtotal = 0;

  items.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name} <strong class="mx-2">x</strong> ${item.quantity}</td>
      <td>$${itemTotal.toFixed(2)}</td>
    `;
    container.appendChild(row);
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
  container.insertAdjacentHTML('beforeend', totals);
}

function displayCheckoutItems(items) {
  // Find the billing section
  const billingSection = document.querySelector('.col-md-6.mb-5.mb-md-0');
  
  if (!billingSection) {
    console.log('Billing section not found');
    return;
  }

  // Check if items display already exists
  if (document.querySelector('.checkout-cart-items')) {
    return;
  }

  const itemsDisplay = document.createElement('div');
  itemsDisplay.className = 'checkout-cart-items mb-4';
  
  let itemsHTML = `
    <h3 class="h5 mb-3 text-black font-weight-bold">Your Items (${items.length})</h3>
    <div class="checkout-items-list">
  `;

  items.forEach(item => {
    itemsHTML += `
      <div class="checkout-item">
        <div class="checkout-item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="checkout-item-info">
          <h4 class="checkout-item-name">${item.name}</h4>
          <p class="checkout-item-quantity">Quantity: ${item.quantity}</p>
          <p class="checkout-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      </div>
    `;
  });

  itemsHTML += `</div>`;
  itemsDisplay.innerHTML = itemsHTML;
  
  // Insert at the beginning of billing section
  billingSection.insertBefore(itemsDisplay, billingSection.firstChild);
}

async function handlePlaceOrder(items) {
    const placeOrderBtn = document.querySelector('.btn-black.btn-lg.py-3.btn-block');
    
    placeOrderBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        // 1. Collect Billing Info
        const orderData = {
            firstName: document.getElementById('c_fname').value,
            lastName: document.getElementById('c_lname').value,
            email: document.getElementById('c_email_address').value,
            addressStreet: document.getElementById('c_address').value,
            postalZip: document.getElementById('c_postal_zip').value,
            phone: document.getElementById('c_phone').value,
            // 2. Attach the items from the cart!
            cartItems: items, 
            totalAmount: items.reduce((sum, i) => sum + (i.price * i.quantity), 0)
        };

        // 3. Send to Node.js Server
        try {
            const response = await fetch('http://localhost:3000/orders/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                localStorage.removeItem('furniCart'); // Clear cart on success
                alert("Order Placed Successfully!");
                window.location.href = 'thankyou.html';
            }
        } catch (err) {
            alert("Checkout failed. Is your server running?");
        }
    });
}

function showEmptyCartMessage() {
  const container = document.querySelector('.untree_co-section .container');
  
  if (container) {
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'text-center py-5';
    emptyMessage.innerHTML = `
      <div style="padding: 60px 20px;">
        <i class="fa fa-shopping-cart" style="font-size: 80px; color: #d0d0d0; margin-bottom: 20px;"></i>
        <h2 class="mb-3">Your Cart is Empty</h2>
        <p class="mb-4" style="color: #6a6a6a;">Add some items to your cart before checking out.</p>
        <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
      </div>
    `;
    
    // Clear the existing content and show empty message
    const rowElement = container.querySelector('.row');
    if (rowElement) {
      rowElement.innerHTML = '';
      rowElement.appendChild(emptyMessage);
    }
  }
}