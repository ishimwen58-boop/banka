const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

// ... imports
const nodemailer = require('nodemailer');

// Helper to send email
const sendTransactionEmail = async (user, type, amount, balance, accountNumber) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: `Banka Transaction Alert: ${type.toUpperCase()}`,
            text: `
                Dear ${user.firstName},

                A transaction has occurred on your account ${accountNumber}.

                Type: ${type.toUpperCase()}
                Amount: ${amount} Rwf
                New Balance: ${balance} Rwf
                Date: ${new Date().toLocaleString()}

                Thank you for banking with us.
            `
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Email notification failed:', error);
    }
};

// @desc    Debit account
// @route   POST /api/transactions/:accountNumber/debit
// @access  Private/Staff (Cashier)
exports.debitAccount = async (req, res) => {
    try {
        const { amount } = req.body;
        const { accountNumber } = req.params;

        const account = await Account.findOne({ accountNumber }).populate('user');

        if (!account) {
            return res.status(404).json({ success: false, error: 'Account not found' });
        }

        if (account.status !== 'active') {
            return res.status(400).json({ success: false, error: 'Account is not active' });
        }

        if (account.balance < amount) {
            return res.status(400).json({ success: false, error: 'Insufficient funds' });
        }

        const oldBalance = account.balance;
        account.balance -= amount;
        await account.save();

        const transaction = await Transaction.create({
            account: account._id,
            cashier: req.user.id,
            type: 'debit',
            amount,
            oldBalance,
            newBalance: account.balance,
        });

        // Send Email Notification
        if (account.user && account.user.email) {
            sendTransactionEmail(account.user, 'debit', amount, account.balance, accountNumber);
        }

        res.status(200).json({
            success: true,
            data: {
                transactionId: transaction._id,
                accountNumber,
                amount,
                cashier: req.user.id,
                transactionType: 'debit',
                accountBalance: account.balance,
            },
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Credit account
// @route   POST /api/transactions/:accountNumber/credit
// @access  Private/Staff (Cashier)
exports.creditAccount = async (req, res) => {
    try {
        const { amount } = req.body;
        const { accountNumber } = req.params;

        const account = await Account.findOne({ accountNumber }).populate('user');

        if (!account) {
            return res.status(404).json({ success: false, error: 'Account not found' });
        }

        if (account.status !== 'active') {
            return res.status(400).json({ success: false, error: 'Account is not active' });
        }

        const oldBalance = account.balance;
        account.balance += Number(amount);
        await account.save();

        const transaction = await Transaction.create({
            account: account._id,
            cashier: req.user.id,
            type: 'credit',
            amount,
            oldBalance,
            newBalance: account.balance,
        });

        // Send Email Notification
        if (account.user && account.user.email) {
            sendTransactionEmail(account.user, 'credit', amount, account.balance, accountNumber);
        }

        res.status(200).json({
            success: true,
            data: {
                transactionId: transaction._id,
                accountNumber,
                amount,
                cashier: req.user.id,
                transactionType: 'credit',
                accountBalance: account.balance,
            },
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get account transactions
// @route   GET /api/accounts/:accountNumber/transactions
// @access  Private/Client/Staff/Admin
exports.getTransactions = async (req, res) => {
    try {
        const { accountNumber } = req.params;
        const account = await Account.findOne({ accountNumber });

        if (!account) {
            return res.status(404).json({ success: false, error: 'Account not found' });
        }

        // Check ownership if client
        if (req.user.role === 'client' && account.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, error: 'Not authorized to access this account' });
        }

        const transactions = await Transaction.find({ account: account._id }).populate('cashier', 'firstName lastName');

        res.status(200).json({ success: true, count: transactions.length, data: transactions });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
}

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private/Client/Staff/Admin
exports.getTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id).populate('account').populate('cashier', 'firstName lastName');

        if (!transaction) {
            return res.status(404).json({ success: false, error: 'Transaction not found' });
        }

        // Check ownership if client
        if (req.user.role === 'client') {
            const account = await Account.findById(transaction.account);
            if (account.user.toString() !== req.user.id) {
                return res.status(403).json({ success: false, error: 'Not authorized to access this transaction' });
            }
        }

        res.status(200).json({ success: true, data: transaction });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get all transactions (Admin/Staff)
// @route   GET /api/transactions
// @access  Private/Staff/Admin
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ createdAt: -1 }).populate('account').populate('cashier', 'firstName lastName');
        res.status(200).json({ success: true, count: transactions.length, data: transactions });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
}


// @desc    Get client's own transactions
// @route   GET /api/transactions/me
// @access  Private/Client
exports.getMyTransactions = async (req, res) => {
    try {
        const accounts = await Account.find({ user: req.user.id });
        const accountIds = accounts.map(acc => acc._id);
        const transactions = await Transaction.find({ account: { $in: accountIds } })
            .sort({ createdAt: -1 })
            .populate('account')
            .populate('cashier', 'firstName lastName');

        res.status(200).json({ success: true, count: transactions.length, data: transactions });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
