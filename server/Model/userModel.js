const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const UserModel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobileNo: {
        type: Number,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'vendor'],
        default: 'user'
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    userId: {
        type: String,
        default: uuidv4,
        unique: true
    },
    resetPasswordOtp: {
        type: String,
        default: null
    },
    resetPasswordOtpExpiry: {
        type: Date,
        default: null
    },
    previousOrders: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'productModel' },
            quantity: Number,
            orderedAt: { type: Date, default: Date.now }
        }
    ],
    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'productModel'
        }
    ]
});



const userModel = mongoose.model('userModel', UserModel);

module.exports = userModel;