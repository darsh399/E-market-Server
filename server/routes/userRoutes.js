const Router = require('express').Router();

const userController = require('./../Controller/userController');

Router.get('/getUsers', userController.getAllUsers);
Router.post('/addUser', userController.addUser);
Router.post('/login', userController.loginUser);
Router.post('/:id', userController.updateUser);
Router.delete('/:id', userController.deleteUser);


module.exports= Router;
