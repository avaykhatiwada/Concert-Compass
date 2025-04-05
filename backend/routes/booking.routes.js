const router = require('express').Router();
const Booking = require('../models/Booking');
const Event = require('../models/Event');
// const { isAuthenticated } = require('../middleware/auth');

// Get all bookings (admin only)
router.get('/', async (req, res) => {
  try {
    // Check if user is admin
    // if (req.user.role !== 'admin') {
    //   return res.status(403).json({ message: 'Unauthorized access' });
    // }
    
    const bookings = await Booking.find().populate('event');
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get user's bookings
router.get('/my-bookings', async (req, res) => {
  try {
    // For now, return all bookings since we're not using authentication
    const bookings = await Booking.find().populate('event');
    
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('event');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user is admin or the booking owner
    // if (req.user.role !== 'admin' && 
    //     booking.customer.userId && 
    //     booking.customer.userId.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ message: 'Unauthorized access' });
    // }
    
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create new booking
router.post('/', async (req, res) => {
  try {
    const {
      eventId,
      customerInfo,
      ticketCount,
      totalAmount,
      paymentMethod,
      userId
    } = req.body;
    
    // Validate required fields
    if (!eventId || !customerInfo || !ticketCount || !totalAmount || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Check if event exists and has available tickets
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    if (event.availableTickets < ticketCount) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }
    
    // Generate unique booking ID
    const bookingId = `BK${Date.now().toString().slice(-6)}`;
    const transactionId = `TXN${Date.now().toString().slice(-8)}`;
    
    // Create new booking
    const newBooking = new Booking({
      event: eventId,
      customer: {
        fullName: customerInfo.fullName,
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: customerInfo.address,
        userId: userId || null
      },
      ticketCount,
      totalAmount,
      payment: {
        method: paymentMethod,
        transactionId,
        status: 'completed',
        date: new Date()
      },
      bookingId,
      status: 'confirmed'
    });
    
    // Update event available tickets
    event.availableTickets -= ticketCount;
    
    // Save booking and update event
    await Promise.all([
      newBooking.save(),
      event.save()
    ]);
    
    // Return booking details
    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(400).json({ message: error.message });
  }
});

// Cancel booking
router.patch('/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user is admin or the booking owner
    // if (req.user.role !== 'admin' && 
    //     booking.customer.userId && 
    //     booking.customer.userId.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ message: 'Unauthorized access' });
    // }
    
    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }
    
    // Update booking status
    booking.status = 'cancelled';
    
    // Return tickets to event
    const event = await Event.findById(booking.event);
    if (event) {
      event.availableTickets += booking.ticketCount;
      await event.save();
    }
    
    await booking.save();
    
    res.json(booking);
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 