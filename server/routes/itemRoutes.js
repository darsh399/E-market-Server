const Router = require('express').Router();
const upload = require('./../middleware/multer');
const jwt_auth = require('./../middleware/Token_Auth');

const {addItem, 
    deleteItem, 
    getAllItems,
    updateItem,
searchItem} = require('./../Controller/itemController');


Router.post('/addItem', jwt_auth, upload.single('productImage'), addItem);
Router.get('/allData', getAllItems);
Router.put('/updateitem/:id', updateItem);
Router.delete('/:id', deleteItem);
Router.get('/finditems/:name', searchItem)

module.exports = Router;