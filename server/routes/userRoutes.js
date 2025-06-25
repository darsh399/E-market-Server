const Router = require('express').Router();
const Token_Auth = require('./../middleware/Token_Auth');
const userController = require('./../Controller/userController');

Router.get('/getUsers', userController.getAllUsers);
Router.post('/addUser', userController.addUser);
Router.post('/login', userController.loginUser);
Router.post('/get-previous-orders', Token_Auth, userController.getPreviousOrderedItems);
Router.get('/profile', Token_Auth, userController.getProfile); 
Router.post('/logout',Token_Auth, userController.logoutUser);
Router.post('/forgotPassword',Token_Auth, userController.forgotPassword);
Router.post('/verify-otp',Token_Auth, userController.verifyOtp);
Router.post('/addItem',Token_Auth, userController.addItemInCart);
Router.post('/remove-all-carts-items',Token_Auth, userController.clearCart);
Router.post('/remove-item-from-cart',Token_Auth, userController.removeItemFromCart);
Router.delete('/delete-user/:id',Token_Auth, userController.deleteUser);
Router.post('/reset-password',Token_Auth, userController.resetPassword);
Router.put('/users/:id',Token_Auth, userController.updateUser);
Router.get('/get-items/:id',Token_Auth, userController.getItemFromCart);


module.exports= Router;
