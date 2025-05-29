const marketModel = require('./../Model/marketModel');

exports.addItem = async (req, res) => {
const [productName, productCateogery, productPrice,
productImage, productDescription, productIsAvailable] = req.body;

try{
     
    if(!productName?.trim() || !productCateogery?.trim() || !productPrice?.trim() ||
    !productImage?.trim() || !productDescription?.trim() || !productIsAvailable?.trim())
    return res.status(400).json({
        success: false,
        message: 'all fields are required...'
    })


      const newItem = new marketModel({
        productName,
        productCateogery,
        productPrice,
        productImage,
        productDescription,
        productIsAvailable
      });

      await newItem.save();
      res.status(200).json({ success: true, message: 'new Item added successfully..'});
}catch(error){
    res.status(500).json({success: false ,message:'error in adding item :', error});
}
}

exports.deleteItem = async (req, res) => {
   const id = req.params.id;
   try{
     const deletedItem = await marketModel.findByIdAndDelete(id);
     if (deletedItem) {
        console.log("Item deleted successfully..");
        res.status(200).json({ status: true, message: "Item deleted successfully.." })
      } else {
        res.status(404).json({ status: false, message: "Item not found.." });
      }
  
   }catch(error){
    res.status(400).json({success: false, message: 'error in deleting item...'})
   }
}

exports.getAllItems = (req, res) => {
    try{
        const itemsData = marketModel.find();
        if(itemsData){
            res.status(200).json({success: true, itemsData})
        }
        res.status(404).json({success: false, message: 'No Data Found...'})
    }catch(error){
        res.status(500).json({status:false, message:"facing error to fetch item data"});
    }
}

