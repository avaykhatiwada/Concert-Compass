const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.CLERK_JWT_PUBLIC_KEY, {
      algorithms: ['RS256'],
    });

    // Get or create user in our database
    let user = await User.findOne({ clerkId: decoded.sub });
    
    if (!user) {
      user = await User.create({
        clerkId: decoded.sub,
        email: decoded.email,
        profile: {
          firstName: decoded.firstName,
          lastName: decoded.lastName
        }
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

const requireOrganizer = async (req, res, next) => {
  if (req.user.role !== 'organizer') {
    return res.status(403).json({ message: 'Organizer access required' });
  }
  next();
};

module.exports = {
  requireAuth,
  requireOrganizer
}; 