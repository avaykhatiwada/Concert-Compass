const express = require('express');
const router = express.Router();
const Artist = require('../models/Artist');
const { requireAuth } = require('../middleware/clerk.middleware');

// Get all artists
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all artists');
    const artists = await Artist.find()
      .select('-__v')
      .sort({ name: 1 });
    
    console.log('Found artists:', artists.length);
    res.json(artists);
  } catch (error) {
    console.error('Error fetching all artists:', error);
    res.status(500).json({ message: 'Error fetching artists', error: error.message });
  }
});

// Get artist by ID
router.get('/:id', async (req, res) => {
  try {
    console.log('Fetching artist with ID:', req.params.id);
    
    // Validate ID format
    if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      console.error('Invalid artist ID format:', req.params.id);
      return res.status(400).json({ 
        message: 'Invalid artist ID format',
        details: 'The ID must be a valid MongoDB ObjectId'
      });
    }

    const artist = await Artist.findById(req.params.id)
      .select('-__v')
      .populate({
        path: 'upcomingPerformances.event',
        select: 'title date time venue price status image',
        match: { status: { $in: ['APPROVED', 'PUBLISHED'] } }
      });

    if (!artist) {
      console.log('Artist not found with ID:', req.params.id);
      return res.status(404).json({ 
        message: 'Artist not found',
        details: 'No artist exists with the provided ID'
      });
    }

    // Filter out any null values from populated events (in case they were deleted or are not published)
    artist.upcomingPerformances = artist.upcomingPerformances.filter(perf => perf.event);

    // Sort upcoming performances by date
    artist.upcomingPerformances.sort((a, b) => new Date(a.date) - new Date(b.date));

    console.log('Successfully fetched artist:', {
      id: artist._id,
      name: artist.name,
      genre: artist.genre,
      performancesCount: artist.upcomingPerformances?.length || 0
    });
    
    res.json(artist);
  } catch (error) {
    console.error('Error fetching artist details:', error);
    res.status(500).json({ 
      message: 'Error fetching artist details', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Create new artist (protected route)
router.post('/', requireAuth, async (req, res) => {
  try {
    console.log('Creating new artist:', {
      name: req.body.name,
      genre: req.body.genre
    });

    const artist = new Artist(req.body);
    await artist.save();
    
    console.log('Created new artist:', {
      id: artist._id,
      name: artist.name
    });
    
    res.status(201).json(artist);
  } catch (error) {
    console.error('Error creating artist:', error);
    res.status(400).json({ 
      message: 'Error creating artist', 
      error: error.message,
      validationErrors: error.errors
    });
  }
});

// Update artist (protected route)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    console.log('Updating artist:', {
      id: req.params.id,
      updates: req.body
    });

    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid artist ID format' });
    }

    const artist = await Artist.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    console.log('Updated artist:', {
      id: artist._id,
      name: artist.name,
      updatedAt: artist.updatedAt
    });
    
    res.json(artist);
  } catch (error) {
    console.error('Error updating artist:', error);
    res.status(400).json({ 
      message: 'Error updating artist', 
      error: error.message,
      validationErrors: error.errors
    });
  }
});

// Delete artist (protected route)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    console.log('Attempting to delete artist:', req.params.id);

    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid artist ID format' });
    }

    const artist = await Artist.findByIdAndDelete(req.params.id);
    
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    console.log('Successfully deleted artist:', {
      id: artist._id,
      name: artist.name
    });
    
    res.json({ 
      message: 'Artist deleted successfully',
      deletedArtist: {
        id: artist._id,
        name: artist.name
      }
    });
  } catch (error) {
    console.error('Error deleting artist:', error);
    res.status(500).json({ 
      message: 'Error deleting artist', 
      error: error.message 
    });
  }
});

module.exports = router; 