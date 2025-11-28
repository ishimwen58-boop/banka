const express = require('express');
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
} = require('../controllers/userController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin', 'staff')); // Staff can view, Admin can do all (refined below)

router
    .route('/')
    .get(getUsers)
    .post(authorize('admin'), createUser);

router
    .route('/:id')
    .get(getUser)
    .put(authorize('admin'), updateUser)
    .delete(authorize('admin'), deleteUser);

module.exports = router;
