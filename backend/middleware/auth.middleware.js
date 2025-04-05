const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { verifyToken } = require('../services/clerk');

// Get admin emails from environment
const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim().toLowerCase()) || [];

const roles = {
  ADMIN: 'admin',
  ORGANIZER: 'organizer',
  CUSTOMER: 'customer'
};

const verifyTokenAndAttachUser = async (req, res, next) => {
  try {
    const userEmail = req.headers['x-user-email']?.toLowerCase();
    if (!userEmail) {
      console.log('No email provided in headers');
      return res.status(401).json({ message: 'No email provided' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Invalid or missing authorization header:', { authHeader });
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Verifying token for:', { 
      userEmail,
      tokenLength: token.length,
      authHeader: authHeader.substring(0, 20) + '...'  // Log part of header for debugging
    });

    const decoded = await verifyToken(token, userEmail);
    if (!decoded) {
      console.log('Token verification failed');
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Check if the email from token matches the header
    const tokenEmail = decoded.email?.toLowerCase();
    if (!tokenEmail) {
      console.log('No email found in token:', decoded);
      return res.status(401).json({ message: 'No email found in token' });
    }

    if (tokenEmail !== userEmail) {
      console.log('Email mismatch:', {
        tokenEmail,
        headerEmail: userEmail
      });
      return res.status(401).json({ message: 'Email mismatch between token and headers' });
    }

    // Find or create user
    let user = await User.findOne({ email: userEmail });
    const isAdmin = adminEmails.includes(userEmail);
    
    if (!user) {
      user = await User.create({
        email: userEmail,
        clerkId: decoded.sub,
        role: isAdmin ? roles.ADMIN : roles.CUSTOMER,
        profile: {
          firstName: decoded.given_name || '',
          lastName: decoded.family_name || ''
        }
      });
      console.log('Created new user:', {
        email: userEmail,
        role: user.role,
        isAdmin
      });
    } else if (isAdmin && user.role !== roles.ADMIN) {
      // Update existing user to admin if their email is in ADMIN_EMAILS
      user.role = roles.ADMIN;
      await user.save();
      console.log('Updated user to admin:', {
        email: userEmail,
        previousRole: user.role,
        newRole: roles.ADMIN
      });
    }

    // Attach user to request
    req.user = user;
    console.log('User authenticated:', {
      email: user.email,
      role: user.role,
      id: user._id,
      isAdmin
    });

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.role === roles.ADMIN) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
      });
    }

    next();
  };
};

const isAdmin = requireRole(roles.ADMIN);
const isOrganizer = requireRole(roles.ORGANIZER);
const isCustomer = requireRole(roles.CUSTOMER);
const isAdminOrOrganizer = requireRole(roles.ADMIN, roles.ORGANIZER);

const checkAdmin = async (req, res, next) => {
  try {
    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];
    
    if (!req.user?.email) {
      return res.status(401).json({ message: 'No user email found' });
    }

    const isAdmin = adminEmails.includes(req.user.email.toLowerCase());
    console.log('Admin check:', {
      userEmail: req.user.email,
      isAdmin,
      adminEmails
    });

    if (!isAdmin) {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  roles,
  verifyTokenAndAttachUser,
  requireRole,
  isAdmin,
  isOrganizer,
  isCustomer,
  isAdminOrOrganizer,
  checkAdmin
}; 