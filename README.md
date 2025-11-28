# Banka - Core Banking Application

Banka is a lightweight core banking application that powers banking operations like account creation, customer deposit and withdrawals. This app is meant to support a single bank, where users can sign up and create bank accounts, which they can use to hold money.

## Features

### Core Features
- **User Authentication**: Sign up and Login with JWT and Cookies.
- **Account Management**: Create savings or current accounts.
- **Transactions**: Staff (Cashiers) can credit and debit user accounts.
- **History**: Users can view their transaction history.
- **Admin Dashboard**: Admins can manage users and bank accounts.

### Additional Features (Custom)
1.  **Transaction Email Alerts**:
    -   Users receive instant email notifications whenever a credit or debit transaction occurs on their account.
    -   This enhances security and keeps users informed about their financial activity in real-time.
    -   *Implementation*: Uses `nodemailer` to send emails via SMTP upon successful transaction processing.

2.  **Two-Factor Authentication (2FA)**:
    -   Adds an extra layer of security to the login process.
    -   Users must verify their identity using a 6-digit code sent to their email after entering their password.
    -   *Implementation*: Generates a temporary code stored in the database (hashed) and emails it to the user.

3.  **Dark Mode Support**:
    -   A fully integrated dark theme that respects user preference and system settings.
    -   Provides a comfortable viewing experience in low-light environments.

## Technologies Used
-   **Frontend**: HTML, CSS, JavaScript (Vanilla)
-   **Backend**: Node.js, Express
-   **Database**: MongoDB
-   **Authentication**: JSON Web Tokens (JWT), bcryptjs
-   **Email Service**: Nodemailer

## Setup Instructions

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Variables**:
    Create a `.env` file in the root directory with the following:
    ```env
    PORT=3000
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    EMAIL_USER=your_email@gmail.com
    EMAIL_PASS=your_email_app_password
    ```
4.  **Run the server**:
    ```bash
    npm run dev
    ```
5.  **Access the app**:
    Open `http://localhost:3000` in your browser.

## User Roles
-   **Client**: Can create accounts and view history.
-   **Staff**: Can perform cashier operations (credit/debit).
-   **Admin**: Can manage all users and accounts (activate/deactivate/delete).
