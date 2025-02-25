const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const requireAuth = (requiredUserType) => async (req, res, next) => {
  const token = req.headers && req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'You must be logged in to access this route' });
  }

  try {
    const secretKey = process.env.SECRET || 'defaultSecret'; // Fallback secret
    const decoded = jwt.verify(token, secretKey);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (user.userType !== requiredUserType) {
      return res.status(403).json({ error: 'Access denied' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = requireAuth;
