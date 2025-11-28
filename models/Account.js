const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        enum: ['savings', 'current'],
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'dormant', 'draft'],
        default: 'active',
    },
    balance: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Account', AccountSchema);
