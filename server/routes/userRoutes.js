const Router = require('express').Router();
const Token_Auth = require('./../middleware/Token_Auth');
const userController = require('./../Controller/userController');

Router.get('/getUsers', userController.getAllUsers);
Router.post('/addUser', userController.addUser);
Router.post('/login', userController.loginUser);
Router.get('/profile', Token_Auth, userController.getProfile); 
Router.post('/logout', userController.logoutUser);
Router.post('/forgotPassword', userController.forgotPassword);
Router.post('/verify-otp', userController.verifyOtp);
Router.post('/addItem', userController.addItemInCart);
Router.post('/remove-all-carts-items', userController.clearCart);
Router.post('/remove-item-from-cart', userController.removeItemFromCart);
Router.delete('/delete-user/:id', userController.deleteUser);
Router.post('/reset-password', userController.resetPassword);
Router.put('/users/:id', userController.updateUser);
Router.get('/get-items/:id', userController.getItemFromCart);


module.exports= Router;
