const marketModel = require('./../Model/marketModel');

exports.addItem = async (req, res) => {
  try {
    const {
      productName,
      productCateogery,
      productPrice,
      productDescription,
      productIsAvailable,
      productQuantity
    } = req.body;

    const productImage = req.file?.filename; 

    if (
      !productName?.trim() ||
      !productCateogery?.trim() ||
      productPrice === undefined ||
      !productImage ||
      !productDescription?.trim() ||
      productIsAvailable === undefined ||
      productQuantity === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required...'
      });
    }

    const newItem = new marketModel({
      productName,
      productCateogery,
      productPrice,
      productImage,
      productDescription,
      productIsAvailable,
      productQuantity
    });

    await newItem.save();

    res.status(200).json({ success: true, message: 'New Item added successfully..' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error in adding item:', error });
  }
};

exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedItem = await marketModel.findByIdAndDelete(id);
    if (deletedItem) {
      console.log("Item deleted successfully..");
      res.status(200).json({ status: true, message: "Item deleted successfully.." })
    } else {
      res.status(404).json({ status: false, message: "Item not found.." });
    }

  } catch (error) {
    res.status(400).json({ success: false, message: 'error in deleting item...' })
  }
}

exports.getAllItems = async (req, res) => {
  try {
    const itemsData = await marketModel.find();

    if (itemsData && itemsData.length > 0) {
      return res.status(200).json({ success: true, itemsData });
    } else {
      return res.status(404).json({ success: false, message: 'No Data Found...' });
    }
  } catch (error) {
    return res.status(500).json({ status: false, message: "Facing error to fetch item data" });
  }
}

exports.searchItem = async (req, res) => {
  const name = req.params.name;
  try {
    const regex = new RegExp(name, 'i');
    const data = marketModel.find({ productName: regex });
    if (data) {
      return res.status(200).json({ success: true, itemsData });
    } else {
      return res.status(404).json({ success: false, message: 'No Data Found...' });
    }

  } catch (error) {
    return res.status(500).json({ status: false, message: "Facing error to fetch item data" });
  }

}


exports.updateItem = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedData = req.body;
    const updatedItem = await marketModel.findByIdAndUpdate(id, updatedData, { new: true });
    if (updatedItem) {
      res.status(200).json({ status: true, message: "Item updated successfully.." });
    }
    console.log('Item updated successfully...');
  } catch (error) {
    res.status(404).json({ status: false, message: 'error in updating Item' });
  }
}
