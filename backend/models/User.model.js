const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  role: {
    type: String,
    enum: ['admin', 'organizer', 'customer'],
    default: 'customer',
    required: true
  },
  profile: {
    firstName: String,
    lastName: String,
    phoneNumber: String,
    avatar: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema); 