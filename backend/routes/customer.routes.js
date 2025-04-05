const router = require('express').Router();
const Customer = require('../models/Customer.model');
const Event = require('../models/Event');

// Get all ticket bookings
router.get('/tickets', async (req, res) => {
  try {
    const bookings = await Customer.find().populate('event_id');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Book new tickets
router.post('/tickets', async (req, res) => {
  try {
    const { event_id, tickets_booked, payment_method, total_amount } = req.body;
    
    // Check event availability
    const event = await Event.findById(event_id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    if (event.remaining_tickets < tickets_booked) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    // Create booking
    const newBooking = new Customer({
      event_id,
      tickets_booked,
      payment_method,
      total_amount
    });
    
    // Update event tickets
    event.booked_tickets += tickets_booked;
    event.remaining_tickets -= tickets_booked;
    event.gross_profit += total_amount;
    
    await Promise.all([
      newBooking.save(),
      event.save()
    ]);

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Export customer data
router.get('/export', async (req, res) => {
  try {
    const customers = await Customer.find()
      .populate('event_id')
      .select('-__v')
      .lean();
      
    // Transform data for export
    const exportData = customers.map(customer => ({
      Event: customer.event_id.name,
      TicketsBooked: customer.tickets_booked,
      PaymentMethod: customer.payment_method,
      TotalAmount: customer.total_amount,
      BookingDate: customer.createdAt
    }));

    res.json(exportData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 