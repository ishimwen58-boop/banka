const express = require('express');
const {
    createAccount,
    getAccounts,
    getAccount,
    updateAccount,
    deleteAccount,
    getMyAccounts
} = require('../controllers/accountController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/me', getMyAccounts);

router
    .route('/')
    .get(authorize('admin', 'staff'), getAccounts)
    .post(authorize('client'), createAccount);

router
    .route('/:id')
    .get(authorize('admin', 'staff', 'client'), getAccount)
    .put(authorize('admin', 'staff'), updateAccount)
    .delete(authorize('admin'), deleteAccount);

module.exports = router;
