const userModel = require('./../Model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('./../utils/SendEmail');

const hashedPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);
    return hashPassword;

  } catch (error) {
    res.status(400).json({ success: false, message: 'error in hasing password' });
  }
}

const create_Token = async (user) => {
  try {
    const tokenData = await jwt.sign({ _id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log('token created', tokenData)
    return tokenData;
  } catch (error) {
    res.status(400).json({ success: false, message: error });
  }
}

exports.addUser = async (req, res) => {
  const { name, email, mobileNo, password, role } = req.body;
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


    const hashPassword = await hashedPassword(password)

    const newUser = new userModel({
      name: name,
      email: email,
      mobileNo: mobileNo,
      password: hashPassword,
      role: role
    });

    await newUser.save();

    res.status(200).json({ success: true, message: "User Created Successfully..." })

  } catch (error) {
    res.status(500).message({ success: false, message: "error in adding user" });
  }
}


exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedUser = await userModel.findByIdAndDelete(id);
    if (deletedUser) {
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
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const jwt_Token = await create_Token(user);

    res.cookie('token', jwt_Token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNo: user.mobileNo,
        role: user.role
      }
    });


  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login.', error });
  }
};


exports.getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (err) {
    res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};


exports.logoutUser = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during logout.',
      error,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  const { Email } = req.body;

  try {
    if (!Email?.trim()) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await userModel.findOne({ email: Email });
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, an OTP has been sent'
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpiry = otpExpiry;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset OTP',
      html: `
        <p>You requested a password reset for your account.</p>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>This OTP is valid for 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    };


    await sendEmail(mailOptions);

    return res.status(200).json({
      success: true,
      message: 'OTP sent to email if account exists'
    });

  } catch (error) {
    console.error('Error in forgotPassword:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing forgot password request'
    });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email?.trim() || !otp?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    const user = await userModel.findOne({
      email,
      resetPasswordOtp: otp,
      resetPasswordOtpExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP or OTP expired'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully'
    });

  } catch (error) {
    console.error('Error in verifyOtp:', error);
    return res.status(500).json({
      success: false,
      message: 'Error verifying OTP'
    });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    if (!email?.trim() || !otp?.trim() || !newPassword?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email, OTP and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const user = await userModel.findOne({
      email,
      resetPasswordOtp: otp,
      resetPasswordOtpExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP or OTP expired'
      });
    }

    const hashedPass = await hashedPassword(newPassword);

    user.password = hashedPass;
    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpiry = null;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Updated Successfully',
      html: '<p>Your password has been successfully reset.</p>'
    };

    await sendEmail(mailOptions);

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Error in resetPassword:', error);
    return res.status(500).json({
      success: false,
      message: 'Error resetting password'
    });
  }
};


exports.addItemInCart = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isItemInCart = user.cart.includes(productId);
    if (!isItemInCart) {
      user.cart.push(productId);
      await user.save();
    }

    return res.status(200).json({ success: true, message: 'Item added in cart' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};


exports.getItemFromCart = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await userModel.findById(userId).populate('cart');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User Not Found' });
    }
    return res.status(200).json({ success: true, cartItems: user.cart });
    ;
  } catch (err) {

    res.status(500).json({ error: err.message });
  }
}
