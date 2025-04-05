const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  venue: {
    name: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    },
    capacity: Number
  },
  artists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist'
  }],
  price: {
    type: Number,
    required: true,
    min: 0
  },
  availableTickets: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'PUBLISHED', 'CANCELLED', 'COMPLETED'],
    default: 'DRAFT'
  },
  image: {
    type: String,
    required: false
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

// Method to check ticket availability
eventSchema.methods.checkAvailability = function(quantity) {
  return this.availableTickets >= quantity;
};

// Method to reserve tickets
eventSchema.methods.reserveTickets = function(quantity) {
  if (!this.checkAvailability(quantity)) {
    throw new Error('Not enough tickets available');
  }
  this.availableTickets -= quantity;
  return this.save();
};

// Method to release tickets
eventSchema.methods.releaseTickets = function(quantity) {
  this.availableTickets += quantity;
  return this.save();
};

module.exports = mongoose.model('Event', eventSchema); 