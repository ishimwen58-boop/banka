const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Date filter for transactions
        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter = {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            };
        } else if (startDate) {
            dateFilter = { createdAt: { $gte: new Date(startDate) } };
        } else if (endDate) {
            dateFilter = { createdAt: { $lte: new Date(endDate) } };
        }

        // 1. Account Stats
        const activeAccounts = await Account.countDocuments({ status: 'active' });
        const dormantAccounts = await Account.countDocuments({ status: 'dormant' });

        // 2. Transaction Stats (Money Deposited/Withdrawn)
        // Aggregate for Credit (Deposited)
        const creditStats = await Transaction.aggregate([
            { $match: { type: 'credit', ...dateFilter } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        // Aggregate for Debit (Withdrawn)
        const debitStats = await Transaction.aggregate([
            { $match: { type: 'debit', ...dateFilter } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const totalDeposited = creditStats.length > 0 ? creditStats[0].total : 0;
        const totalWithdrawn = debitStats.length > 0 ? debitStats[0].total : 0;

        res.status(200).json({
            success: true,
            data: {
                activeAccounts,
                dormantAccounts,
                totalDeposited,
                totalWithdrawn,
                dateRange: {
                    start: startDate || 'All Time',
                    end: endDate || 'All Time'
                }
            }
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
