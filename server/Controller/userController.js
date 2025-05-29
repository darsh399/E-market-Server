const userModel = require('./../Model/userModel');
const bcrypt = require('bcrypt');


exports.addUser = async (req, res) => {
  const { name, email, mobileNo, isAdmin, password } = req.body;
  try {
    if (!name?.trim() || !email?.trim() || !mobileNo?.trim() || !password?.trim()) {
      return res.status(400).json({
        success: false,
        message: "all fields are requird.."
      });
    }

    const existingUser = await userModel.findOne({ $or: [{ email }, { mobileNo }] });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exist..'
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new userModel({
      name: name,
      email: email,
      mobileNo: mobileNo,
      password: hashedPassword,
      isAdmin: isAdmin
    });

    await newUser.save();

    res.status(200).json({ success: true, message: "User Created Successfully..." })

  } catch (error) {
    res.status(500).message({ success: false, message: error });
  }
}


exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedUser = await userModel.findByIdAndDelete(id);
    if (deletedUser) {
      console.log("user deleted successfully..");
      res.status(200).json({ status: true, message: "user deleted successfully.." })
    } else {
      res.status(404).json({ status: false, message: "User not found.." });
    }


  } catch (error) {
    res.status(500).json({ status: false, message: `error occurred in delete user`, error })
  }
}

exports.updateUser = async (req, res) => {
  const id = req.params.id;
  try {
    const updateData = req.body;
    const updatedUser = await userModel.findByIdAndUpdate(id, updateData, { new: true });
    if (updatedUser) {
      res.status(200).json({ status: true, message: "User updated successfully.." });
    }
    console.log(`user updates successfully..`);
  } catch (error) {
    res.status(404).json({ status: false, message: `error is updating user: `, error });
  }
}


exports.getAllUsers = async (req, res) => {
  try {
    const data = await userModel.find();

    if (data.length > 0) {
      return res.status(200).json({ status: true, data });
    }

    return res.status(404).json({ status: false, message: 'No Users found..' });

  } catch (error) {
    res.status(500).json({ status: false, message: "facing error to fetch users" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await userModel.findOne({ email });
    console.log('after email ' ,email, password)
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('after matched ',email, password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login.', error });
  }
};
