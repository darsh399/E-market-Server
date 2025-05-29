const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');


const UserModel = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    mobileNo:{
        type: Number,
        required: true,
        unique: true
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    userId:{
        type: String,
        default: uuidv4,
        unique: true
    }
})

const userModel = mongoose.model('userModel', UserModel);

module.exports = userModel;