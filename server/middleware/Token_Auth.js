const jwt = require('jsonwebtoken');

const Token_Auth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = 
    req.body.token || 
    req.query.token || 
    (authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); 
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Token is invalid or expired' });
  }
};

module.exports = Token_Auth;
