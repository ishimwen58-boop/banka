const express = require('express');
const {
    debitAccount,
    creditAccount,
    getTransactions,
    getAllTransactions,
    getMyTransactions,
    getTransaction
} = require('../controllers/transactionController');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/:accountNumber/debit', authorize('staff'), debitAccount);
router.post('/:accountNumber/credit', authorize('staff'), creditAccount);
router.get('/:accountNumber/transactions', authorize('client', 'staff', 'admin'), getTransactions);
router.get('/me', authorize('client'), getMyTransactions);
router.get('/', authorize('staff', 'admin'), getAllTransactions);
router.get('/:id', authorize('client', 'staff', 'admin'), getTransaction);

module.exports = router;
