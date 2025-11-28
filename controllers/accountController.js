const Account = require('../models/Account');
const User = require('../models/User');

// @desc    Create account
// @route   POST /api/accounts
// @access  Private/Client
exports.createAccount = async (req, res) => {
    try {
        const { type } = req.body;

        // Generate random account number
        const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();

        const account = await Account.create({
            user: req.user.id,
            accountNumber,
            type,
        });

        res.status(201).json({ success: true, data: account });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get all accounts
// @route   GET /api/accounts
// @access  Private/Admin/Staff
exports.getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find().populate('user', 'firstName lastName email');
        res.status(200).json({ success: true, count: accounts.length, data: accounts });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get single account
// @route   GET /api/accounts/:id
// @access  Private/Admin/Staff/Owner
exports.getAccount = async (req, res) => {
    try {
        const account = await Account.findById(req.params.id).populate('user', 'firstName lastName email');

        if (!account) {
            return res.status(404).json({ success: false, error: 'Account not found' });
        }

        // Check ownership if client
        if (req.user.role === 'client' && account.user._id.toString() !== req.user.id) {
            return res.status(403).json({ success: false, error: 'Not authorized to access this account' });
        }

        res.status(200).json({ success: true, data: account });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update account status
// @route   PUT /api/accounts/:id
// @access  Private/Admin/Staff
exports.updateAccount = async (req, res) => {
    try {
        const { status } = req.body;
        const account = await Account.findByIdAndUpdate(req.params.id, { status }, {
            new: true,
            runValidators: true,
        });

        if (!account) {
            return res.status(404).json({ success: false, error: 'Account not found' });
        }

        res.status(200).json({ success: true, data: account });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete account
// @route   DELETE /api/accounts/:id
// @access  Private/Admin
exports.deleteAccount = async (req, res) => {
    try {
        const account = await Account.findByIdAndDelete(req.params.id);

        if (!account) {
            return res.status(404).json({ success: false, error: 'Account not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get my accounts
// @route   GET /api/accounts/me
// @access  Private/Client
exports.getMyAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({ user: req.user.id });
        res.status(200).json({ success: true, count: accounts.length, data: accounts });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
}
