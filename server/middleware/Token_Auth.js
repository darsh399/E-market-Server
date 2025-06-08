const jwt = require('jsonwebtoken');

const Token_Auth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || 
      req.body?.token || 
      req.query?.token || 
      (req.headers?.authorization?.startsWith('Bearer ') 
        ? req.headers.authorization.split(' ')[1] 
        : null);

    if (!token) {
      return res.status(401).json({ success: false, message: 'Token is required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();

  } catch (error) {
    return res.status(403).json({ success: false, message: 'Token is invalid or expired' });
  }
};

module.exports = Token_Auth;
