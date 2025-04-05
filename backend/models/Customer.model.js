const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  tickets_booked: {
    type: Number,
    required: true,
    min: 1
  },
  payment_method: {
    type: String,
    required: true,
    enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer']
  },
  total_amount: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema); 