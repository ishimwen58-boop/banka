# Banka - Core Banking Application



### Additional Features (Custom)
1.  **Transaction Email Alerts**:
    -   Users receive instant email notifications whenever a credit or debit transaction occurs on their account.
    -   This enhances security and keeps users informed about their financial activity in real-time.
    -   *Implementation*: Uses `nodemailer` to send emails via SMTP upon successful transaction processing.



2.  **Dark Mode Support**:
    -   A fully integrated dark theme that respects user preference and system settings.
    -   Provides a comfortable viewing experience in low-light environments.


## User Roles
-   **Client**: Can create accounts and view history.
-   **Staff**: Can perform cashier operations (credit/debit).
-   **Admin**: Can manage all users and accounts (activate/deactivate/delete).
