const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-production-domain.com' 
    : 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Email']
}));
app.use(express.json());

// Improved MongoDB connection with error handling
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Successfully connected to MongoDB.');
  console.log('Database URI:', process.env.MONGODB_URI);
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

// Monitor MongoDB connection
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Routes
const { requireAuth, requireOrganizer } = require('./middleware/clerk.middleware');
const authRoutes = require('./routes/auth');

// Debug route to verify server is running
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Public routes
app.use('/api/events', require('./routes/event.routes'));
app.use('/api/artists', require('./routes/artistRoutes'));
app.use('/api/bookings', require('./routes/booking.routes'));

// Protected routes
app.use('/api/organizer', requireAuth, requireOrganizer, require('./routes/organizer.routes'));
app.use('/api/customer', requireAuth, require('./routes/customer.routes'));
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
}); 