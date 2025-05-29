const Router = require('express').Router();

const {addItem, 
    deleteItem, 
    getAllItems} = require('./../Controller/itemController');


Router.post('/addItem', addItem);
Router.delete('/:id', deleteItem);
Router.get('/allData', getAllItems);

module.exports = Router;