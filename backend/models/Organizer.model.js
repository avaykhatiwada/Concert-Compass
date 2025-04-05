const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
  design_url: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  feedback: String
});

const ideaSchema = new mongoose.Schema({
  idea: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  feedback: String
});

const organizerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  designs: [designSchema],
  ideas: [ideaSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Organizer', organizerSchema); 