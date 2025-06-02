const Router = require('express').Router();

const {addItem, 
    deleteItem, 
    getAllItems,
    updateItem,
searchItem} = require('./../Controller/itemController');


Router.post('/addItem', addItem);
Router.get('/allData', getAllItems);
Router.put('/updateitem/:id', updateItem);
Router.delete('/:id', deleteItem);
Router.get('/finditems/:name', searchItem)

module.exports = Router;