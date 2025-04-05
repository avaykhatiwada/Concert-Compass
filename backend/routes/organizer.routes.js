const router = require('express').Router();
const Organizer = require('../models/Organizer.model');

// Get all designs
router.get('/designs', async (req, res) => {
  try {
    const designs = await Organizer.find({}, 'designs');
    res.json(designs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit a new design
router.post('/designs', async (req, res) => {
  try {
    const { organizerId, design_url } = req.body;
    const organizer = await Organizer.findById(organizerId);
    
    if (!organizer) {
      return res.status(404).json({ message: 'Organizer not found' });
    }

    organizer.designs.push({ design_url });
    await organizer.save();
    
    res.status(201).json(organizer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update design status
router.put('/designs/:id', async (req, res) => {
  try {
    const { organizerId, status, feedback } = req.body;
    const organizer = await Organizer.findOneAndUpdate(
      { 
        '_id': organizerId,
        'designs._id': req.params.id 
      },
      {
        $set: {
          'designs.$.status': status,
          'designs.$.feedback': feedback
        }
      },
      { new: true }
    );
    
    if (!organizer) {
      return res.status(404).json({ message: 'Design not found' });
    }
    
    res.json(organizer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 