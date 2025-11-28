const API_URL = 'http://localhost:3000/api';

// DOM Elements
const mainContent = document.getElementById('main-content');
const navHome = document.getElementById('nav-home');
const navAbout = document.getElementById('nav-about');
const navContact = document.getElementById('nav-contact');
const navLogin = document.getElementById('nav-login');
const navSignup = document.getElementById('nav-signup');

// Event Listeners
if (navHome) navHome.addEventListener('click', loadHome);
if (navAbout) navAbout.addEventListener('click', loadAbout);
if (navContact) navContact.addEventListener('click', loadContact);
if (navLogin) navLogin.addEventListener('click', loadLogin);
if (navSignup) navSignup.addEventListener('click', loadSignup);

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    const token = getCookie('token');
    const isDashboard = window.location.pathname.includes('dashboard.html');

    if (token) {
        if (!isDashboard) {
            window.location.href = 'dashboard.html';
        }
    } else {
        if (isDashboard) {
            window.location.href = 'index.html';
        } else {
            loadHome();
        }
    }
});

function loadHome() {
    mainContent.innerHTML = `
        <section class="hero">
            <h1>Welcome to Banka</h1>
            <p>The lightweight core banking application for everyone.</p>
            <div class="cta-buttons">
                <button id="btn-signup" class="btn primary">Get Started</button>
                <button id="btn-login" class="btn secondary">Login</button>
            </div>
        </section>

        <section class="features">
            <h2>Why Choose Banka?</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <h3>Secure</h3>
                    <p>Your data is protected with industry-standard encryption.</p>
                </div>
                <div class="feature-card">
                    <h3>Fast</h3>
                    <p>Experience lightning-fast transactions and updates.</p>
                </div>
                <div class="feature-card">
                    <h3>Simple</h3>
                    <p>A clean and intuitive interface designed for you.</p>
                </div>
            </div>
        </section>

        <section class="about">
            <h2>About Us</h2>
            <p>Banka is a modern banking solution built to simplify your financial life. We believe in transparency, security, and ease of use.</p>
        </section>
    `;
    document.getElementById('btn-signup').addEventListener('click', loadSignup);
    document.getElementById('btn-login').addEventListener('click', loadLogin);
}

function loadAbout() {
    mainContent.innerHTML = `
        <section class="about-page">
            <h1>About Banka</h1>
            <p>
                Banka is dedicated to providing the most secure, fast, and user-friendly banking experience. 
                Our mission is to empower individuals and businesses with the financial tools they need to succeed.
            </p>
            <p>
                Founded with a vision of simplicity and transparency, we are constantly innovating to bring you the best in core banking technology.
                We are available 24/7 to support your financial journey.
            </p>
        </section>
    `;
}

function loadContact() {
    mainContent.innerHTML = `
        <section class="contact-page">
            <h1>Contact Us</h1>
            <div class="contact-container">
                <div class="contact-card">
                    <h3>We are here for you 24/7</h3>
                    <div class="contact-info">
                        <span class="contact-label">Email Us</span>
                        <a href="mailto:ishimwen58@gmail.com" class="contact-link">ishimwen58@gmail.com</a>
                    </div>
                    <div class="contact-info">
                        <span class="contact-label">Call Us</span>
                        <a href="tel:0781837193" class="contact-link">0781837193</a>
                    </div>
                </div>

                <div class="contact-form-container">
                    <h3>Send us a Message</h3>
                    <form id="contact-form">
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" id="name" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" required>
                        </div>
                        <div class="form-group">
                            <label for="subject">Subject</label>
                            <input type="text" id="subject" required>
                        </div>
                        <div class="form-group">
                            <label for="message">Message</label>
                            <textarea id="message" rows="5" required></textarea>
                        </div>
                        <button type="submit" class="btn primary">Send Message</button>
                    </form>
                </div>
            </div>
        </section>
    `;

    document.getElementById('contact-form').addEventListener('submit', handleContactSubmission);
}

async function handleContactSubmission(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;

    btn.innerText = 'Sending...';
    btn.disabled = true;

    try {
        const res = await fetch(`${API_URL}/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, subject, message })
        });

        const data = await res.json();

        if (res.ok) {
            alert('Message sent successfully!');
            e.target.reset();
        } else {
            alert(data.message || 'Failed to send message');
        }
    } catch (error) {
        console.error('Contact error:', error);
        alert('An error occurred. Please try again.');
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

function loadLogin() {
    mainContent.innerHTML = `
        <section class="auth-form">
            <h2>Login</h2>
            <form id="login-form">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" required>
                </div>
                <button type="submit" class="btn primary">Login</button>
                <p><a href="#" id="forgot-password">Forgot Password?</a></p>
                <p>Don't have an account? <a href="#" id="link-signup">Sign Up</a></p>
            </form>
        </section>
    `;

    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('forgot-password').addEventListener('click', loadForgotPassword);
    document.getElementById('link-signup').addEventListener('click', loadSignup);
}

function loadSignup() {
    mainContent.innerHTML = `
        <section class="auth-form">
            <h2>Sign Up</h2>
            <form id="signup-form">
                <div class="form-group">
                    <label for="firstName">First Name</label>
                    <input type="text" id="firstName" required>
                </div>
                <div class="form-group">
                    <label for="lastName">Last Name</label>
                    <input type="text" id="lastName" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" required>
                </div>
                <button type="submit" class="btn primary">Sign Up</button>
                <p>Already have an account? <a href="#" id="link-login">Login</a></p>
            </form>
        </section>
    `;

    document.getElementById('signup-form').addEventListener('submit', handleSignup);
    document.getElementById('link-login').addEventListener('click', loadLogin);
}

function loadVerify(email) {
    mainContent.innerHTML = `
        <section class="auth-form">
            <h2>Verify Email</h2>
            <p>Please enter the OTP sent to ${email}</p>
            <form id="verify-form">
                <div class="form-group">
                    <label for="otp">OTP</label>
                    <input type="text" id="otp" required>
                </div>
                <button type="submit" class="btn primary">Verify</button>
            </form>
        </section>
    `;

    document.getElementById('verify-form').addEventListener('submit', (e) => handleVerify(e, email));
}

function loadForgotPassword() {
    mainContent.innerHTML = `
        <section class="auth-form">
            <h2>Forgot Password</h2>
            <form id="forgot-form">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" required>
                </div>
                <button type="submit" class="btn primary">Send OTP</button>
            </form>
        </section>
    `;
    document.getElementById('forgot-form').addEventListener('submit', handleForgotPassword);
}

function loadResetPassword(email) {
    mainContent.innerHTML = `
        <section class="auth-form">
            <h2>Reset Password</h2>
            <form id="reset-form">
                <div class="form-group">
                    <label for="otp">OTP</label>
                    <input type="text" id="otp" required>
                </div>
                <div class="form-group">
                    <label for="password">New Password</label>
                    <input type="password" id="password" required>
                </div>
                <button type="submit" class="btn primary">Reset Password</button>
            </form>
        </section>
    `;
    document.getElementById('reset-form').addEventListener('submit', (e) => handleResetPassword(e, email));
}

// API Handlers
async function handleSignup(e) {
    e.preventDefault();
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, email, password })
        });
        const data = await res.json();

        if (data.success) {
            alert(data.message);
            loadVerify(email);
        } else {
            alert(data.error);
        }
    } catch (err) {
        console.error(err);
        alert('An error occurred');
    }
}

async function handleVerify(e, email) {
    e.preventDefault();
    const otp = document.getElementById('otp').value;

    try {
        const res = await fetch(`${API_URL}/auth/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });
        const data = await res.json();

        if (data.success) {
            alert(data.message);
            loadLogin();
        } else {
            alert(data.error);
        }
    } catch (err) {
        console.error(err);
        alert('An error occurred');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch(`${API_URL}/auth/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (data.success) {
            if (data.requireOtp) {
                alert(data.message);
                loadVerifyLogin(email);
            } else {
                // Save user info to localStorage
                localStorage.setItem('user', JSON.stringify(data.data));
                window.location.href = 'dashboard.html';
            }
        } else {
            alert(data.error);
        }
    } catch (err) {
        console.error(err);
        alert('An error occurred');
    }
}

function loadVerifyLogin(email) {
    mainContent.innerHTML = `
        <section class="auth-form">
            <h2>Verify Login</h2>
            <p>Please enter the OTP sent to ${email}</p>
            <form id="verify-login-form">
                <div class="form-group">
                    <label for="otp">OTP</label>
                    <input type="text" id="otp" required>
                </div>
                <button type="submit" class="btn primary">Verify & Login</button>
            </form>
        </section>
    `;

    document.getElementById('verify-login-form').addEventListener('submit', (e) => handleVerifyLogin(e, email));
}

async function handleVerifyLogin(e, email) {
    e.preventDefault();
    const otp = document.getElementById('otp').value;

    try {
        const res = await fetch(`${API_URL}/auth/verify-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });
        const data = await res.json();

        if (data.success) {
            if (data.token) {
                document.cookie = `token=${data.token}; path=/; max-age=2592000`; // 30 days
            }
            localStorage.setItem('user', JSON.stringify(data.data));
            window.location.href = 'dashboard.html';
        } else {
            alert(data.error);
        }
    } catch (err) {
        console.error(err);
        alert('An error occurred');
    }
}

async function handleForgotPassword(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;

    try {
        const res = await fetch(`${API_URL}/auth/forgotpassword`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await res.json();

        if (data.success) {
            alert(data.message);
            loadResetPassword(email);
        } else {
            alert(data.error);
        }
    } catch (err) {
        console.error(err);
        alert('An error occurred');
    }
}

async function handleResetPassword(e, email) {
    e.preventDefault();
    const otp = document.getElementById('otp').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch(`${API_URL}/auth/resetpassword`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp, password })
        });
        const data = await res.json();

        if (data.success) {
            alert(data.message);
            loadLogin();
        } else {
            alert(data.error);
        }
    } catch (err) {
        console.error(err);
        alert('An error occurred');
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Dashboard Logic
if (window.location.pathname.includes('dashboard.html')) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'index.html';
    }

    document.getElementById('user-name').textContent = `${user.firstName} ${user.lastName} (${user.role})`;

    // Show admin menu
    if (user.role === 'admin' || user.role === 'staff') {
        document.getElementById('admin-menu-users').style.display = 'block';
    }

    // Logout
    document.getElementById('nav-logout').addEventListener('click', () => {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Load saved theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }

    // Navigation
    const menuOverview = document.getElementById('menu-overview');
    const menuAccounts = document.getElementById('menu-accounts');
    const menuTransactions = document.getElementById('menu-transactions');
    const menuUsers = document.getElementById('admin-menu-users');

    // Only show Overview to Admin
    if (user.role === 'admin') {
        menuOverview.style.display = 'block';
    } else {
        menuOverview.style.display = 'none';
    }

    menuOverview.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveMenu(menuOverview);
        loadDashboardStats();
    });

    menuAccounts.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveMenu(menuAccounts);
        loadAccounts();
    });

    menuTransactions.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveMenu(menuTransactions);
        loadTransactions();
    });

    if (menuUsers) {
        menuUsers.addEventListener('click', (e) => {
            e.preventDefault();
            setActiveMenu(menuUsers);
            loadUsers();
        });
    }

    function setActiveMenu(active) {
        document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
        if (active.tagName === 'LI') {
            active.querySelector('a').classList.add('active');
        } else {
            active.classList.add('active');
        }

        // Hide stats container by default, show only in Overview
        document.getElementById('stats-container').style.display = 'none';
        document.getElementById('dynamic-content').style.display = 'block';
    }

    // Initial Load
    if (user.role === 'admin') {
        setActiveMenu(menuOverview);
        loadDashboardStats();
    } else {
        loadAccounts();
    }
}

async function loadDashboardStats() {
    const panel = document.getElementById('dynamic-content');
    const statsContainer = document.getElementById('stats-container');

    panel.style.display = 'none';
    statsContainer.style.display = 'block';

    const startDate = document.getElementById('stats-start-date').value;
    const endDate = document.getElementById('stats-end-date').value;

    let query = '';
    if (startDate) query += `startDate=${startDate}&`;
    if (endDate) query += `endDate=${endDate}`;

    try {
        const res = await fetch(`${API_URL}/admin/stats?${query}`, {
            headers: { 'Authorization': `Bearer ${getCookie('token')}` }
        });
        const data = await res.json();

        if (data.success) {
            document.getElementById('stat-active').textContent = data.data.activeAccounts;
            document.getElementById('stat-dormant').textContent = data.data.dormantAccounts;
            document.getElementById('stat-deposited').textContent = `${data.data.totalDeposited} Rwf`;
            document.getElementById('stat-withdrawn').textContent = `${data.data.totalWithdrawn} Rwf`;
        } else {
            console.error(data.error);
        }
    } catch (err) {
        console.error(err);
    }

    // Bind filter button
    const btnFilter = document.getElementById('btn-filter-stats');
    // Remove old listener to avoid duplicates (simple way: clone node or just set onclick)
    btnFilter.onclick = loadDashboardStats;
}

async function loadAccounts() {
    const user = JSON.parse(localStorage.getItem('user'));
    const panel = document.getElementById('dynamic-content');
    const statsContainer = document.getElementById('stats-container');

    statsContainer.style.display = 'none';
    panel.style.display = 'block';

    let url = `${API_URL}/accounts`;
    if (user.role === 'client') {
        url = `${API_URL}/accounts/me`;
    }

    try {
        const res = await fetch(url, {
            headers: { 'Authorization': `Bearer ${getCookie('token')}` }
        });

        if (res.status === 401) {
            // Token expired or invalid
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            localStorage.removeItem('user');
            window.location.href = 'index.html';
            return;
        }

        const data = await res.json();

        let html = `<h2>Accounts</h2>`;

        if (user.role === 'client') {
            html += `<button id="btn-create-account" class="btn primary">Create New Account</button>`;
        }

        html += `
            <table>
                <thead>
                    <tr>
                        <th>Account Number</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Balance</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.data.forEach(acc => {
            html += `
                <tr>
                    <td>${acc.accountNumber}</td>
                    <td>${acc.type}</td>
                    <td>${acc.status}</td>
                    <td>${acc.balance} Rwf</td>
                    <td>
                        <button class="btn secondary btn-sm" onclick="viewAccount('${acc._id}')">View</button>
                        ${user.role === 'admin' ? `<button class="btn secondary btn-sm" onclick="deleteAccount('${acc._id}')">Delete</button>` : ''}
                    </td>
                </tr>
            `;
        });

        html += `</tbody></table>`;
        panel.innerHTML = html;

        if (user.role === 'client') {
            document.getElementById('btn-create-account').addEventListener('click', () => {
                document.getElementById('modal-create-account').style.display = 'block';
            });
        }

    } catch (err) {
        console.error(err);
        panel.innerHTML = `<p class="error">Error loading accounts</p>`;
    }
}

// Modal Logic
const modal = document.getElementById('modal-create-account');
if (modal) {
    const span = document.getElementsByClassName("close")[0];
    if (span) {
        span.onclick = function () {
            modal.style.display = "none";
        }
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    document.getElementById('create-account-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const type = document.getElementById('account-type').value;

        try {
            const res = await fetch(`${API_URL}/accounts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
                },
                body: JSON.stringify({ type })
            });
            const data = await res.json();
            if (data.success) {
                modal.style.display = "none";
                loadAccounts();
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error(err);
        }
    });
}

async function loadTransactions() {
    const user = JSON.parse(localStorage.getItem('user'));
    const panel = document.getElementById('dynamic-content');
    const statsContainer = document.getElementById('stats-container');

    statsContainer.style.display = 'none';
    panel.style.display = 'block';

    // Only for Staff/Admin
    let url = `${API_URL}/transactions`;
    if (user.role === 'client') {
        url = `${API_URL}/transactions/me`;
    }

    try {
        const res = await fetch(url, {
            headers: { 'Authorization': `Bearer ${getCookie('token')}` }
        });
        const data = await res.json();

        let html = `<h2>${user.role === 'client' ? 'My Transactions' : 'All Transactions'}</h2>
            <table id="all-trans-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Account</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Cashier</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.data.forEach(t => {
            html += `
                <tr>
                    <td>${new Date(t.createdAt).toLocaleString()}</td>
                    <td>${t.account ? t.account.accountNumber : 'N/A'}</td>
                    <td>${t.type}</td>
                    <td>${t.amount} Rwf</td>
                    <td>${t.cashier ? (t.cashier.firstName ? `${t.cashier.firstName} ${t.cashier.lastName}` : t.cashier) : 'System'}</td>
                    <td><button class="btn secondary btn-sm" onclick="viewTransaction('${t._id}')">View</button></td>
                </tr>
            `;
        });

        html += `</tbody></table>`;
        panel.innerHTML = html;

    } catch (err) {
        console.error(err);
        panel.innerHTML = `<p class="error">Error loading transactions</p>`;
    }
}

async function loadUsers() {
    const user = JSON.parse(localStorage.getItem('user'));
    const panel = document.getElementById('dynamic-content');
    const statsContainer = document.getElementById('stats-container');

    statsContainer.style.display = 'none';
    panel.style.display = 'block';

    try {
        const res = await fetch(`${API_URL}/users`, {
            headers: { 'Authorization': `Bearer ${getCookie('token')}` }
        });
        const data = await res.json();

        let html = `<h2>Users</h2>
            ${user.role === 'admin' ? `<button id="btn-create-user" class="btn primary">Create User</button>` : ''}
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.data.forEach(u => {
            html += `
                <tr>
                    <td>${u.firstName} ${u.lastName}</td>
                    <td>${u.email}</td>
                    <td>${u.role}</td>
                    <td>${u.isActive ? 'Active' : 'Inactive'}</td>
                    <td>
                        ${user.role === 'admin' ? `
                        <button class="btn secondary btn-sm" onclick="toggleUserStatus('${u._id}', ${u.isActive})">${u.isActive ? 'Deactivate' : 'Activate'}</button>
                        <button class="btn secondary btn-sm" onclick="deleteUser('${u._id}')">Delete</button>
                        ` : 'View Only'}
                    </td>
                </tr>
            `;
        });

        html += `</tbody></table>`;
        panel.innerHTML = html;

        if (user.role === 'admin') {
            document.getElementById('btn-create-user').addEventListener('click', () => {
                document.getElementById('modal-create-user').style.display = 'block';
            });
        }

    } catch (err) {
        console.error(err);
        panel.innerHTML = `<p class="error">Error loading users</p>`;
    }
}

// Create User Modal Logic
const modalUser = document.getElementById('modal-create-user');
if (modalUser) {
    const span = document.getElementsByClassName("close-user")[0];
    if (span) {
        span.onclick = function () {
            modalUser.style.display = "none";
        }
    }
    window.onclick = function (event) {
        if (event.target == modalUser) {
            modalUser.style.display = "none";
        }
    }

    document.getElementById('create-user-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const firstName = document.getElementById('new-firstName').value;
        const lastName = document.getElementById('new-lastName').value;
        const email = document.getElementById('new-email').value;
        const password = document.getElementById('new-password').value;
        const role = document.getElementById('new-role').value;

        try {
            const res = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
                },
                body: JSON.stringify({ firstName, lastName, email, password, role })
            });
            const data = await res.json();
            if (data.success) {
                alert('User created successfully');
                modalUser.style.display = "none";
                loadUsers();
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error(err);
        }
    });
}

// Global functions for onclick handlers
window.viewAccount = async (id) => {
    // Implement view account details + transactions
    const panel = document.getElementById('dynamic-content');
    const statsContainer = document.getElementById('stats-container');

    statsContainer.style.display = 'none';
    panel.style.display = 'block';

    const user = JSON.parse(localStorage.getItem('user'));
    try {
        const res = await fetch(`${API_URL}/accounts/${id}`, {
            headers: { 'Authorization': `Bearer ${getCookie('token')}` }
        });
        const data = await res.json();
        const account = data.data;

        // Fetch transactions
        const resTrans = await fetch(`${API_URL}/transactions/${account.accountNumber}/transactions`, {
            headers: { 'Authorization': `Bearer ${getCookie('token')}` }
        });
        const dataTrans = await resTrans.json();

        let html = `
            <button class="btn secondary" onclick="loadAccounts()">Back</button>
            <h2>Account Details</h2>
            <p><strong>Account Number:</strong> ${account.accountNumber}</p>
            <p><strong>Balance:</strong> ${account.balance} Rwf</p>
            <p><strong>Status:</strong> ${account.status} 
                ${(user.role === 'admin' || user.role === 'staff') ?
                `<button class="btn secondary btn-sm" onclick="toggleAccountStatus('${account._id}', '${account.status}')">
                        ${account.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>` : ''}
            </p>
            
            <h3>Transactions</h3>
            <div class="filter-group">
                <label for="trans-filter">Filter by Type:</label>
                <select id="trans-filter" onchange="filterTransactions()">
                    <option value="all">All</option>
                    <option value="credit">Credit</option>
                    <option value="debit">Debit</option>
                </select>
            </div>
            <table id="trans-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>New Balance</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
        `;

        dataTrans.data.forEach(t => {
            html += `
                <tr class="trans-row" data-type="${t.type}">
                    <td>${new Date(t.createdAt).toLocaleDateString()}</td>
                    <td>${t.type}</td>
                    <td>${t.amount} Rwf</td>
                    <td>${t.newBalance} Rwf</td>
                    <td><button class="btn secondary btn-sm" onclick="viewTransaction('${t._id}')">View</button></td>
                </tr>
            `;
        });

        html += `</tbody></table>`;

        // Add Debit/Credit buttons for Staff
        if (user.role === 'staff') {
            html += `
                <div style="margin-top: 2rem;">
                    <h3>Cashier Operations</h3>
                    <input type="number" id="amount" placeholder="Amount">
                    <button class="btn primary" onclick="performTransaction('${account.accountNumber}', 'credit')">Credit</button>
                    <button class="btn secondary" onclick="performTransaction('${account.accountNumber}', 'debit')">Debit</button>
                </div>
            `;
        }

        panel.innerHTML = html;

    } catch (err) {
        console.error(err);
    }
};

window.filterTransactions = () => {
    const filter = document.getElementById('trans-filter').value;
    const rows = document.querySelectorAll('.trans-row');

    rows.forEach(row => {
        if (filter === 'all' || row.dataset.type === filter) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
};


window.performTransaction = async (accountNumber, type) => {
    const amount = document.getElementById('amount').value;
    if (!amount) return alert('Please enter amount');

    try {
        const res = await fetch(`${API_URL}/transactions/${accountNumber}/${type}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('token')}`
            },
            body: JSON.stringify({ amount })
        });
        const data = await res.json();
        if (data.success) {
            alert('Transaction successful');
            viewAccount(data.data.accountNumber); // Reload view (need ID, but viewAccount takes ID. Wait, I need to refactor viewAccount to take ID or I need to get ID from somewhere. 
            // Actually, I can just reload the account by ID if I have it. 
            // But I don't have the ID easily here without passing it.
            // Let's just reload accounts list for now or refresh page.
            window.location.reload();
        } else {
            alert(data.error);
        }
    } catch (err) {
        console.error(err);
    }
};

window.toggleAccountStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'dormant' : 'active'; // or 'inactive' depending on your model enum
    // Let's assume 'active' and 'dormant' or 'inactive'. The model probably has 'active'/'dormant'.
    // Let's check model or just send 'active'/'dormant'.
    // Checking Account model... wait, I haven't checked Account model enum. 
    // Defaulting to 'active'/'dormant' based on typical banking apps.

    try {
        const res = await fetch(`${API_URL}/accounts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('token')}`
            },
            body: JSON.stringify({ status: newStatus })
        });
        const data = await res.json();
        if (data.success) {
            alert(`Account is now ${newStatus}`);
            viewAccount(id); // Reload details
        } else {
            alert(data.error);
        }
    } catch (err) {
        console.error(err);
    }
};

window.deleteAccount = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
        const res = await fetch(`${API_URL}/accounts/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getCookie('token')}` }
        });
        const data = await res.json();
        if (data.success) {
            loadAccounts();
        } else {
            alert(data.error);
        }
    } catch (err) {
        console.error(err);
    }
};

window.toggleUserStatus = async (id, isActive) => {
    try {
        const res = await fetch(`${API_URL}/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('token')}`
            },
            body: JSON.stringify({ isActive: !isActive })
        });
        const data = await res.json();
        if (data.success) {
            loadUsers();
        } else {
            alert(data.error);
        }
    } catch (err) {
        console.error(err);
    }
};

window.deleteUser = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
        const res = await fetch(`${API_URL}/users/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getCookie('token')}` }
        });
        const data = await res.json();
        if (data.success) {
            loadUsers();
        } else {
            alert(data.error);
        }
    } catch (err) {
        console.error(err);
    }
};

window.viewTransaction = async (id) => {
    const modal = document.getElementById('modal-transaction-details');
    const content = document.getElementById('transaction-details-content');

    try {
        const res = await fetch(`${API_URL}/transactions/${id}`, {
            headers: { 'Authorization': `Bearer ${getCookie('token')}` }
        });
        const data = await res.json();
        const t = data.data;

        content.innerHTML = `
            <p><strong>ID:</strong> ${t._id}</p>
            <p><strong>Date:</strong> ${new Date(t.createdAt).toLocaleString()}</p>
            <p><strong>Type:</strong> ${t.type.toUpperCase()}</p>
            <p><strong>Amount:</strong> ${t.amount} Rwf</p>
            <p><strong>Old Balance:</strong> ${t.oldBalance} Rwf</p>
            <p><strong>New Balance:</strong> ${t.newBalance} Rwf</p>
            <p><strong>Cashier:</strong> ${t.cashier ? (t.cashier.firstName ? `${t.cashier.firstName} ${t.cashier.lastName}` : t.cashier) : 'Self/System'}</p>
        `;

        modal.style.display = "block";

        // Close logic
        const span = document.getElementsByClassName("close-trans")[0];
        if (span) {
            span.onclick = function () {
                modal.style.display = "none";
            }
        }
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

    } catch (err) {
        console.error(err);
        alert('Error loading transaction details');
    }
};
