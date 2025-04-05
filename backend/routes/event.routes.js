const router = require('express').Router();
const Event = require('../models/Event');
const Artist = require('../models/Artist');
const { verifyTokenAndAttachUser, isAdmin, isOrganizer, isAdminOrOrganizer } = require('../middleware/auth.middleware');

// Public routes
// Get all published events
router.get('/public', async (req, res) => {
  try {
    console.log('Fetching published and approved events');
    const events = await Event.find({ 
      status: { $in: ['PUBLISHED', 'APPROVED'] }
    })
      .sort({ date: 1 })
      .populate({
        path: 'artists',
        select: 'name genre image bio social _id'
      })
      .populate('organizer', 'profile.firstName profile.lastName');
    
    // Log artist data for debugging
    events.forEach(event => {
      console.log(`Event ${event.title} (status: ${event.status}) artists:`, event.artists.map(artist => ({
        id: artist._id,
        name: artist.name,
        genre: artist.genre,
        hasImage: !!artist.image,
        hasBio: !!artist.bio
      })));
    });

    // Validate artist data before sending
    const validatedEvents = events.map(event => {
      if (event.artists && Array.isArray(event.artists)) {
        event.artists = event.artists.filter(artist => artist && artist._id);
      } else {
        console.warn(`No artists array found for event ${event.title}`);
        event.artists = [];
      }
      return event;
    });

    console.log('Fetched published and approved events:', validatedEvents.length);
    res.json(validatedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: error.message });
  }
});

// Protected routes
router.use(verifyTokenAndAttachUser);

// Get all events (admin & organizer)
router.get('/', isAdminOrOrganizer, async (req, res) => {
  try {
    console.log('User role:', req.user.role);
    console.log('User metadata:', req.user.clerkMetadata);
    
    const query = req.user.role === 'organizer' 
      ? { organizer: req.user._id }
      : {};
    
    const events = await Event.find(query)
      .sort({ createdAt: -1 })
      .populate({
        path: 'artists',
        select: 'name genre image bio social'
      })
      .populate('organizer', 'profile.firstName profile.lastName email');
    
    console.log('Found events:', events.length);
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single event
router.get('/:id', isAdminOrOrganizer, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate({
        path: 'artists',
        select: 'name genre image bio social upcomingPerformances'
      })
      .populate('organizer', 'profile.firstName profile.lastName email');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user has access to this event
    if (req.user.role === 'organizer' && event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create new event
router.post('/', isAdminOrOrganizer, async (req, res) => {
  try {
    console.log('Creating event:', {
      userRole: req.user.role,
      userEmail: req.user.email,
      eventTitle: req.body.title,
      userId: req.user._id,
      requestHeaders: {
        auth: !!req.headers.authorization,
        email: req.headers['x-user-email']
      }
    });

    if (!req.user) {
      console.error('No user found in request');
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!req.user.role) {
      console.error('No role found for user:', req.user);
      return res.status(401).json({ message: 'User role not found' });
    }

    if (!req.user._id) {
      console.error('No user ID found:', req.user);
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // First create or update artists
    const artistPromises = req.body.artists.map(async (artistData) => {
      try {
        let artist;
        if (artistData._id) {
          // Update existing artist
          artist = await Artist.findByIdAndUpdate(
            artistData._id,
            { 
              name: artistData.name,
              genre: artistData.genre,
              bio: artistData.bio || artistData.description,
              image: artistData.image,
              social: artistData.socialMedia || artistData.social || {},
              upcomingPerformances: artistData.upcomingPerformances || []
            },
            { new: true, upsert: true }
          );
        } else {
          // Create new artist
          artist = new Artist({
            name: artistData.name,
            genre: artistData.genre,
            bio: artistData.bio || artistData.description,
            image: artistData.image,
            social: artistData.socialMedia || artistData.social || {},
            upcomingPerformances: []
          });
          await artist.save();
        }
        return artist;
      } catch (error) {
        console.error('Error creating/updating artist:', error);
        throw error;
      }
    });

    const savedArtists = await Promise.all(artistPromises);
    console.log('Created/Updated artists:', savedArtists.map(a => ({ id: a._id, name: a.name })));
    
    const artistIds = savedArtists.map(artist => artist._id);

    // Create event with artist references and proper organizer ID
    const eventData = {
      ...req.body,
      artists: artistIds,
      organizer: req.user._id,
      status: req.user.role === 'admin' ? 'APPROVED' : 'PENDING'
    };

    // Remove any extra organizer data that might have been sent
    delete eventData.organizerEmail;
    delete eventData.organizerRole;

    const event = new Event(eventData);
    const savedEvent = await event.save();
    
    // Update artists' upcomingPerformances
    await Promise.all(savedArtists.map(artist => {
      const performance = {
        event: savedEvent._id,
        date: savedEvent.date,
        time: savedEvent.time,
        venue: savedEvent.venue.name,
        ticketPrice: savedEvent.price
      };
      
      artist.upcomingPerformances = artist.upcomingPerformances || [];
      artist.upcomingPerformances.push(performance);
      return artist.save();
    }));
    
    console.log('Event created successfully:', {
      eventId: savedEvent._id,
      status: savedEvent.status,
      organizer: savedEvent.organizer
    });

    // Populate artist data before sending response
    const populatedEvent = await Event.findById(savedEvent._id)
      .populate({
        path: 'artists',
        select: 'name genre image bio social upcomingPerformances'
      })
      .populate('organizer', 'profile.firstName profile.lastName email');

    res.status(201).json(populatedEvent);
  } catch (error) {
    console.error('Error creating event:', {
      error: error.message,
      stack: error.stack,
      user: req.user ? {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role
      } : 'No user'
    });
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Invalid event data', 
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    if (error.name === 'BSONError' || error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid data format',
        details: error.message
      });
    }
    
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
});

// Update event
router.put('/:id', isAdminOrOrganizer, async (req, res) => {
  try {
    console.log('Updating event:', {
      eventId: req.params.id,
      userRole: req.user.role,
      userEmail: req.user.email
    });

    if (!req.user) {
      console.error('No user found in request');
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!req.user.role) {
      console.error('No role found for user:', req.user);
      return res.status(401).json({ message: 'User role not found' });
    }

    // First update artists
    const artistPromises = req.body.artists.map(async (artistData) => {
      if (artistData._id) {
        // Update existing artist
        return Artist.findByIdAndUpdate(
          artistData._id,
          { $set: artistData },
          { new: true, upsert: true }
        );
      } else {
        // Create new artist
        const artist = new Artist(artistData);
        return artist.save();
      }
    });

    const savedArtists = await Promise.all(artistPromises);
    const artistIds = savedArtists.map(artist => artist._id);

    // Update event with artist references
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        artists: artistIds
      },
      { new: true, runValidators: true }
    )
    .populate({
      path: 'artists',
      select: 'name genre image bio social'
    })
    .populate('organizer', 'profile.firstName profile.lastName');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if organizer has permission to update
    if (req.user.role === 'organizer' && event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    // If organizer is updating, set status back to PENDING
    if (req.user.role === 'organizer') {
      event.status = 'PENDING';
    }

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete event
router.delete('/:id', isAdminOrOrganizer, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if organizer has permission to delete
    if (req.user.role === 'organizer' && event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: error.message });
  }
});

// Admin only routes
// Approve/Reject event
router.patch('/:id/status', isAdmin, async (req, res) => {
  try {
    console.log('Updating event status:', {
      eventId: req.params.id,
      newStatus: req.body.status,
      adminUser: req.user.email
    });

    const { status, feedback } = req.body;
    if (!['APPROVED', 'REJECTED', 'PUBLISHED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.status = status;
    event.feedback = feedback;
    event.reviewedBy = req.user._id;
    event.reviewedAt = new Date();

    const updatedEvent = await event.save();
    console.log('Event updated successfully:', updatedEvent);
    
    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event status:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get event statistics (admin only)
router.get('/stats/overview', isAdmin, async (req, res) => {
  try {
    console.log('Fetching stats for admin:', req.user.email);
    
    const stats = await Event.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const organizerCount = await Event.distinct('organizer').length;
    const totalEvents = stats.reduce((acc, curr) => acc + curr.count, 0);

    console.log('Stats:', { stats, organizerCount, totalEvents });
    
    res.json({
      eventStats: stats,
      organizerCount,
      totalEvents
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 