// Security check
if (sessionStorage.getItem('isAdmin') !== 'true') {
    window.location.href = 'admin-login.html';
}

async function loadData(type) {
    const container = document.getElementById('adminTableContainer');
    container.innerHTML = `<div class="text-center p-5"><div class="spinner-border"></div><p>Fetching ${type}...</p></div>`;

    try {
        //using the routes i already have in app.js
        const response = await fetch(`http://localhost:3000/${type}/all`);
        const data = await response.json();

        if (data.length === 0) {
            container.innerHTML = `<p class="text-center p-5">No ${type} found in database.</p>`;
            return;
        }

        let tableHTML = `
            <table class="table">
                <thead>
                    <tr>
                        ${getHeaders(type)}
                        <th class="text-danger">Action</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach(item => {
            tableHTML += `
                <tr>
                    ${getRowData(type, item)}
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deleteItem('${type}', '${item._id}')">
                            <i class="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        tableHTML += `</tbody></table>`;
        container.innerHTML = tableHTML;

    } catch (err) {
        container.innerHTML = `<div class="alert alert-danger">Error connecting to server. Make sure your backend is running.</div>`;
    }
}

function getHeaders(type) {
    if (type === 'orders') return `<th>Customer</th><th>Email</th><th>Total</th><th>Date</th>`;
    if (type === 'contact') return `<th>From</th><th>Email</th><th>Message</th>`;
    if (type === 'newsletter') return `<th>Name</th><th>Email</th>`;
    if (type === 'auth') return `<th>Full Name</th><th>Email</th>`;
    return '';
}

// Generate table row data based on type

function getRowData(type, item) {
    if (type === 'orders') return `<td>${item.firstName} ${item.lastName}</td><td>${item.email}</td><td>$${item.totalAmount}</td><td>${new Date(item.createdAt).toLocaleDateString()}</td>`;
    if (type === 'contact') return `<td>${item.firstName}</td><td>${item.email}</td><td>${item.message}</td>`;
    if (type === 'newsletter') return `<td>${item.name}</td><td>${item.email}</td>`;
    if (type === 'auth') return `<td>${item.fullName}</td><td>${item.email}</td>`;
    return '';
}

// Logout function

async function deleteItem(type, id) {
    if (confirm("Delete this entry forever?")) {
        try {
            const response = await fetch(`http://localhost:3000/${type}/delete/${id}`, { method: 'DELETE' });
            if (response.ok) {
                loadData(type); // Refresh
            }
        } catch (err) {
            alert("Delete failed.");
        }
    }
}
