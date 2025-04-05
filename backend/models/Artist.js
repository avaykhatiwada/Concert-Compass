const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: false
  },
  bio: {
    type: String,
    required: false
  },
  genre: {
    type: String,
    required: false
  },
  social: {
    instagram: String,
    facebook: String,
    youtube: String,
    twitter: String
  },
  upcomingPerformances: [{
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    },
    date: Date,
    time: String,
    venue: String,
    ticketPrice: Number
  }],
  popularSongs: [{
    type: String
  }],
  achievements: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Artist', artistSchema); 