const express = require('express');
const {
    signup,
    verify,
    signin,
    verifyLogin,
    forgotPassword,
    resetPassword
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/verify', verify);
router.post('/signin', signin);
router.post('/verify-login', verifyLogin);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword', resetPassword);

module.exports = router;
