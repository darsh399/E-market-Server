const mongoose = require('mongoose');

const marketSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productCateogery: {
        type: String,
        required: true
    },
    productPrice: {
        type: Number,
        required: true,
        min: [0, "value must be positive"]
    },
    productImage: {
        type: String,
        required: true 
    },
    productQuantity: {
        type: Number,
        required: true,
        min: [0, "quantity must be positive"]
    },
    productIsAvailable: {
        type: Boolean,
        required: true
    },
    productDescription: {
        type: String,
        required: true
    }
});

const productModel = mongoose.model('productModel', marketSchema);

module.exports = productModel;
