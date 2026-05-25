const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies[process.env.COOKIE_NAME || 'teamTaskToken'];
    if (!token) {
      if (req.originalUrl.startsWith('/api/')) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      return res.redirect('/login');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    if (req.originalUrl.startsWith('/api/')) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    res.clearCookie(process.env.COOKIE_NAME || 'teamTaskToken');
    return res.redirect('/login');
  }
};

module.exports = authMiddleware;
