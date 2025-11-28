const User = require('../models/User');
const OTP = require('../models/OTP');
const sendEmail = require('../utils/email');

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, error: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
        });

        // Generate OTP
        const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

        // Save OTP
        await OTP.create({
            email,
            otp: otpCode,
        });

        // Send Email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Banka - Email Verification',
                message: `Your verification code is: ${otpCode}`,
            });
        } catch (err) {
            console.error(err);
            // We don't fail registration if email fails, but user needs to know
        }

        res.status(201).json({
            success: true,
            data: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
            },
            message: 'User registered. Please check email for OTP.',
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Verify email
// @route   POST /api/auth/verify
// @access  Public
exports.verify = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const otpRecord = await OTP.findOne({ email, otp });

        if (!otpRecord) {
            return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        user.isVerified = true;
        await user.save();

        // Delete OTP
        await OTP.deleteOne({ _id: otpRecord._id });

        res.status(200).json({ success: true, message: 'Email verified successfully' });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/signin
// @access  Public
exports.signin = async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    if (!user.isVerified) {
        return res.status(401).json({ success: false, error: 'Please verify your email first' });
    }

    if (!user.isActive) {
        return res.status(401).json({ success: false, error: 'User account is deactivated' });
    }

    // 2FA: Generate and send OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    await OTP.create({ email, otp });

    const message = `Your Login OTP is ${otp}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Login OTP',
            message,
        });

        res.status(200).json({
            success: true,
            message: 'OTP sent to email',
            requireOtp: true
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: 'Email could not be sent' });
    }
};

// @desc    Verify Login OTP
// @route   POST /api/auth/verify-login
// @access  Public
exports.verifyLogin = async (req, res, next) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ success: false, error: 'Please provide email and OTP' });
    }

    // Check OTP
    const response = await OTP.find({ email, otp }).sort({ createdAt: -1 }).limit(1);

    if (response.length === 0 || otp !== response[0].otp) {
        return res.status(400).json({ success: false, error: 'Invalid OTP' });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
    }

    sendTokenResponse(user, 200, res);
};

// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Generate OTP
        const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

        // Save OTP
        await OTP.create({
            email,
            otp: otpCode,
        });

        // Send Email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Banka - Password Reset',
                message: `Your password reset code is: ${otpCode}`,
            });
            res.status(200).json({ success: true, message: 'Email sent' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, error: 'Email could not be sent' });
        }

    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Reset Password
// @route   POST /api/auth/resetpassword
// @access  Public
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        const otpRecord = await OTP.findOne({ email, otp });

        if (!otpRecord) {
            return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        user.password = password; // Will be hashed by pre-save hook
        await user.save();

        // Delete OTP
        await OTP.deleteOne({ _id: otpRecord._id });

        res.status(200).json({ success: true, message: 'Password updated successfully' });

    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
}


// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: false,
    };

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            data: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
        });
};
