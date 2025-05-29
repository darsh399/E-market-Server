const mongoose = require('mongoose');

const marketModel = new mongoose.Schema({
    productName:{
        type: String,
        required: false
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
        require: true
    },
    productQuantity: {
        type: Number,
        required: true
    },
    productDescription: {
        type: String,
        required: false
    },
    productIsAvailable: {
        type: Boolean,
        required: true
    }
});


const productModel = mongoose.model('productModel', marketModel);

module.exports = productModel;