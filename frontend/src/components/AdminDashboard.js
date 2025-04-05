import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton, Alert, Grid } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Instagram, Facebook, YouTube, Twitter, Category } from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useUser, useSession } from '@clerk/clerk-react';

const AdminDashboard = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleOpenDialog = () => {
    console.log('Opening dialog');
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    console.log('Closing dialog');
    setDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleEventSaved = (savedEvent) => {
    console.log('Event saved:', savedEvent);
    setDialogOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Admin Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: 'white',
            px: 3,
          }}
        >
          Create New Event
        </Button>
      </Box>

      <Typography variant="body1">Coming soon...</Typography>

      <EventDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        event={selectedEvent}
        onEventSaved={handleEventSaved}
      />
    </Box>
  );
};

const EventDialog = ({ open, onClose, event, onEventSaved }) => {
  const { session } = useSession();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: null,
    time: '',
    category: 'MUSIC',
    status: 'DRAFT',
    artists: [{
      name: '',
      genre: '',
      description: '',
      image: '',
      social: {
        instagram: '',
        facebook: '',
        youtube: '',
        twitter: ''
      },
      popularSongs: [''],
      achievements: ['']
    }],
    venue: {
      name: '',
      address: '',
      capacity: '',
      facilities: [],
      mapLocation: {
        latitude: '',
        longitude: ''
      }
    },
    ticketTypes: [{
      type: 'General Admission',
      price: '',
      quantity: '',
      description: '',
      benefits: ['Entry to event']
    }],
    imageUrl: ''
  });

  useEffect(() => {
    if (open) {
      console.log('Dialog opened, initializing form data');
      if (event) {
        // Format existing event data
        const formattedArtists = event.artists?.map(artist => ({
          name: artist.name || '',
          genre: artist.genre || '',
          description: artist.description || artist.bio || '',
          image: artist.image || '',
          social: {
            instagram: artist.social?.instagram || artist.socialMedia?.instagram || '',
            facebook: artist.social?.facebook || artist.socialMedia?.facebook || '',
            youtube: artist.social?.youtube || artist.socialMedia?.youtube || '',
            twitter: artist.social?.twitter || artist.socialMedia?.twitter || ''
          },
          popularSongs: artist.popularSongs || [''],
          achievements: artist.achievements || ['']
        })) || [{
          name: '',
          genre: '',
          description: '',
          image: '',
          social: {
            instagram: '',
            facebook: '',
            youtube: '',
            twitter: ''
          },
          popularSongs: [''],
          achievements: ['']
        }];

        setFormData({
          title: event.title || '',
          description: event.description || '',
          date: event.date || null,
          time: event.time || '',
          category: event.category || 'MUSIC',
          status: event.status || 'DRAFT',
          artists: formattedArtists,
          venue: {
            name: event.venue?.name || '',
            address: {
              street: event.venue?.address?.street || '',
              city: event.venue?.address?.city || '',
              state: event.venue?.address?.state || '',
              zipCode: event.venue?.address?.zipCode || ''
            },
            capacity: event.venue?.capacity || '',
            facilities: event.venue?.facilities || [],
            mapLocation: event.venue?.mapLocation || { latitude: '', longitude: '' }
          },
          ticketTypes: event.ticketTypes?.length ? event.ticketTypes : [{
            type: 'General Admission',
            price: '',
            quantity: '',
            description: '',
            benefits: ['Entry to event']
          }],
          imageUrl: event.image || ''
        });
      } else {
        // Reset to initial state for new event
        setFormData({
          title: '',
          description: '',
          date: null,
          time: '',
          category: 'MUSIC',
          status: 'DRAFT',
          artists: [{
            name: '',
            genre: '',
            description: '',
            image: '',
            social: {
              instagram: '',
              facebook: '',
              youtube: '',
              twitter: ''
            },
            popularSongs: [''],
            achievements: ['']
          }],
          venue: {
            name: '',
            address: '',
            capacity: '',
            facilities: [],
            mapLocation: {
              latitude: '',
              longitude: ''
            }
          },
          ticketTypes: [{
            type: 'General Admission',
            price: '',
            quantity: '',
            description: '',
            benefits: ['Entry to event']
          }],
          imageUrl: ''
        });
      }
    }
  }, [open, event]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setError(null);
    
    try {
      setIsSubmitting(true);

      const userEmail = user?.primaryEmailAddress?.emailAddress;
      if (!userEmail || !session) {
        throw new Error('User not authenticated');
      }

      // Get fresh token
      const token = await session.getToken();
      if (!token) {
        throw new Error('Failed to get authentication token');
      }

      console.log('Starting event creation with:', {
        userEmail,
        hasToken: !!token,
        tokenLength: token.length
      });

      // First verify admin status
      const adminCheckResponse = await fetch('/api/auth/check-admin', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-User-Email': userEmail
        },
        credentials: 'include'
      });

      let adminData;
      try {
        adminData = await adminCheckResponse.json();
      } catch (error) {
        console.error('Failed to parse admin check response:', error);
        throw new Error('Invalid admin check response');
      }

      if (!adminCheckResponse.ok || !adminData.isAdmin) {
        console.error('Admin check failed:', adminData);
        throw new Error(adminData.message || 'Not authorized as admin');
      }

      console.log('Admin check successful:', adminData);

      // Validate required fields
      if (!formData.title || !formData.description || !formData.date || 
          !formData.venue.name || !formData.venue.address || 
          formData.artists.length === 0 || formData.ticketTypes.length === 0) {
        throw new Error('Please fill in all required fields');
      }

      // Format date and time
      const eventDate = new Date(formData.date);
      const formattedTime = eventDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });

      // Calculate total capacity and price range
      const totalCapacity = formData.ticketTypes.reduce((total, ticket) => 
        total + (parseInt(ticket.quantity) || 0), 0);
      
      const prices = formData.ticketTypes
        .map(ticket => parseFloat(ticket.price) || 0)
        .filter(price => price > 0);
      
      const minPrice = Math.min(...prices, 0);
      const maxPrice = Math.max(...prices, 0);

      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: eventDate.toISOString(),
        time: formattedTime,
        location: formData.venue.name.trim(),
        price: minPrice,
        capacity: totalCapacity,
        availableTickets: totalCapacity,
        image: formData.imageUrl || 'https://source.unsplash.com/random/800x600/?concert',
        category: formData.category.toUpperCase(),
        status: 'PUBLISHED',
        organizer: adminData._id,
        artists: formData.artists.map(artist => ({
          name: artist.name.trim(),
          genre: 'Various',
          bio: artist.description.trim(),
          image: 'https://source.unsplash.com/random/400x400/?artist',
          social: {
            instagram: '',
            facebook: '',
            youtube: '',
            twitter: ''
          }
        })),
        venue: {
          name: formData.venue.name.trim(),
          address: {
            street: formData.venue.address.trim(),
            city: 'Kathmandu',
            state: 'Bagmati',
            zipCode: '44600'
          },
          capacity: totalCapacity,
          facilities: ['Parking', 'Food & Beverages', 'Restrooms'],
          mapLocation: {
            latitude: 27.7172,
            longitude: 85.3240
          }
        },
        ticketTypes: formData.ticketTypes.map(ticket => ({
          name: ticket.type.trim() || 'General Admission',
          price: parseFloat(ticket.price) || 0,
          quantity: parseInt(ticket.quantity) || 0,
          description: 'Standard entry ticket',
          benefits: ['Entry to event', 'Seating based on availability']
        })),
        budget: maxPrice * totalCapacity,
        expectedCapacity: totalCapacity
      };

      // Get a fresh token for the event creation request
      const freshToken = await session.getToken();
      
      console.log('Sending event creation request:', {
        url: '/api/events',
        method: 'POST',
        hasToken: !!freshToken,
        tokenLength: freshToken.length,
        userEmail,
        eventTitle: eventData.title
      });

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${freshToken}`,
          'Content-Type': 'application/json',
          'X-User-Email': userEmail
        },
        credentials: 'include',
        body: JSON.stringify(eventData)
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (error) {
        console.error('Failed to parse response:', error);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        console.error('Event save failed:', {
          status: response.status,
          statusText: response.statusText,
          error: responseData,
          requestHeaders: {
            auth: !!freshToken,
            email: userEmail
          }
        });
        throw new Error(responseData.message || `Failed to save event: ${response.status} ${response.statusText}`);
      }

      console.log('Event saved successfully:', responseData);

      if (onEventSaved) {
        onEventSaved(responseData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#121212',
          color: 'white',
          minHeight: '80vh',
          maxHeight: '90vh',
          overflowY: 'auto'
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        bgcolor: 'rgba(255, 255, 255, 0.05)'
      }}>
        {event ? 'Edit Event' : 'Create New Event'}
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {error && (
            <Box sx={{ mb: 2 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          
          {/* Basic Information Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ 
              color: 'primary.main', 
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Category fontSize="small" />
              Basic Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Event Name *"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  fullWidth
                  placeholder="Enter a captivating title for your event"
                  helperText="Make it memorable and descriptive"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                    },
                    '& .MuiInputLabel-root': { 
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&.Mui-focused': { color: 'primary.main' }
                    },
                    '& .MuiInputBase-input': { color: 'white' },
                    '& .MuiFormHelperText-root': { color: 'rgba(255, 255, 255, 0.5)' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Event Description *"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  multiline
                  rows={4}
                  required
                  fullWidth
                  placeholder="Describe your event in detail"
                  helperText="Include key highlights and what attendees can expect"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                    },
                    '& .MuiInputLabel-root': { 
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&.Mui-focused': { color: 'primary.main' }
                    },
                    '& .MuiInputBase-input': { color: 'white' },
                    '& .MuiFormHelperText-root': { color: 'rgba(255, 255, 255, 0.5)' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Genre *"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                    },
                    '& .MuiInputLabel-root': { 
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&.Mui-focused': { color: 'primary.main' }
                    },
                    '& .MuiSelect-icon': { color: 'rgba(255, 255, 255, 0.5)' },
                    '& .MuiInputBase-input': { color: 'white' }
                  }}
                >
                  <MenuItem value="POP">Pop</MenuItem>
                  <MenuItem value="ROCK">Rock</MenuItem>
                  <MenuItem value="JAZZ">Jazz</MenuItem>
                  <MenuItem value="CLASSICAL">Classical</MenuItem>
                  <MenuItem value="FOLK">Folk</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>

          {/* Date & Venue Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', mb: 2 }}>
              Date & Venue
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="Event Date"
                  value={formData.date}
                  onChange={(newValue) => {
                    const date = new Date(newValue);
                    setFormData({
                      ...formData,
                      date: date,
                      time: date.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })
                    });
                  }}
                  sx={{
                    width: '100%',
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                    },
                    '& .MuiInputLabel-root': { 
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&.Mui-focused': { color: 'primary.main' }
                    },
                    '& .MuiInputBase-input': { color: 'white' },
                    '& .MuiIconButton-root': { color: 'rgba(255, 255, 255, 0.7)' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Time *"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                  fullWidth
                  helperText="Choose the start time"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    '& .MuiInputBase-input': { color: 'white' },
                    '& .MuiFormHelperText-root': { color: 'rgba(255, 255, 255, 0.5)' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Venue Name *"
                  value={formData.venue.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    venue: { ...formData.venue, name: e.target.value }
                  })}
                  required
                  fullWidth
                  helperText="Enter the venue name"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    '& .MuiInputBase-input': { color: 'white' },
                    '& .MuiFormHelperText-root': { color: 'rgba(255, 255, 255, 0.5)' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Street Address *"
                  value={formData.venue.address}
                  onChange={(e) => setFormData({
                    ...formData,
                    venue: { ...formData.venue, address: e.target.value }
                  })}
                  required
                  fullWidth
                  helperText="Enter the street address"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    '& .MuiInputBase-input': { color: 'white' },
                    '& .MuiFormHelperText-root': { color: 'rgba(255, 255, 255, 0.5)' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="City *"
                  value={formData.venue.city}
                  onChange={(e) => setFormData({
                    ...formData,
                    venue: { ...formData.venue, city: e.target.value }
                  })}
                  required
                  fullWidth
                  helperText="Enter the city"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    '& .MuiInputBase-input': { color: 'white' },
                    '& .MuiFormHelperText-root': { color: 'rgba(255, 255, 255, 0.5)' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Venue Capacity"
                  value={formData.venue.capacity}
                  onChange={(e) => setFormData({
                    ...formData,
                    venue: { ...formData.venue, capacity: e.target.value }
                  })}
                  fullWidth
                  type="number"
                  helperText="Enter venue capacity"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    '& .MuiInputBase-input': { color: 'white' },
                    '& .MuiFormHelperText-root': { color: 'rgba(255, 255, 255, 0.5)' }
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Artists Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', mb: 2 }}>
              Artists
            </Typography>
            {formData.artists.map((artist, index) => (
              <Box
                key={index}
                sx={{
                  mb: 3,
                  p: 3,
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 2,
                  position: 'relative'
                }}
              >
                <Typography variant="subtitle1" gutterBottom>
                  Artist {index + 1}
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Artist Name *"
                      value={artist.name}
                      onChange={(e) => {
                        const newArtists = [...formData.artists];
                        newArtists[index].name = e.target.value;
                        setFormData({ ...formData, artists: newArtists });
                      }}
                      required
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                          '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                          '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                        '& .MuiInputBase-input': { color: 'white' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Genre"
                      value={artist.genre}
                      onChange={(e) => {
                        const newArtists = [...formData.artists];
                        newArtists[index].genre = e.target.value;
                        setFormData({ ...formData, artists: newArtists });
                      }}
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                          '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                          '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                        '& .MuiInputBase-input': { color: 'white' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Artist Description"
                      value={artist.description}
                      onChange={(e) => {
                        const newArtists = [...formData.artists];
                        newArtists[index].description = e.target.value;
                        setFormData({ ...formData, artists: newArtists });
                      }}
                      multiline
                      rows={3}
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                          '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                          '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                        '& .MuiInputBase-input': { color: 'white' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Instagram Handle"
                      value={artist.social.instagram}
                      onChange={(e) => {
                        const newArtists = [...formData.artists];
                        newArtists[index].social.instagram = e.target.value;
                        setFormData({ ...formData, artists: newArtists });
                      }}
                      fullWidth
                      placeholder="@username"
                      InputProps={{
                        startAdornment: <Instagram sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.3)' }} />
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                          '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                          '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                        '& .MuiInputBase-input': { color: 'white' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Facebook Handle"
                      value={artist.social.facebook}
                      onChange={(e) => {
                        const newArtists = [...formData.artists];
                        newArtists[index].social.facebook = e.target.value;
                        setFormData({ ...formData, artists: newArtists });
                      }}
                      fullWidth
                      placeholder="@username"
                      InputProps={{
                        startAdornment: <Facebook sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.3)' }} />
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                          '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                          '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                        '& .MuiInputBase-input': { color: 'white' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="YouTube Channel"
                      value={artist.social.youtube}
                      onChange={(e) => {
                        const newArtists = [...formData.artists];
                        newArtists[index].social.youtube = e.target.value;
                        setFormData({ ...formData, artists: newArtists });
                      }}
                      fullWidth
                      InputProps={{
                        startAdornment: <YouTube sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.3)' }} />
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                          '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                          '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                        '& .MuiInputBase-input': { color: 'white' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Twitter Handle"
                      value={artist.social.twitter}
                      onChange={(e) => {
                        const newArtists = [...formData.artists];
                        newArtists[index].social.twitter = e.target.value;
                        setFormData({ ...formData, artists: newArtists });
                      }}
                      fullWidth
                      placeholder="@username"
                      InputProps={{
                        startAdornment: <Twitter sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.3)' }} />
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                          '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                          '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                        '& .MuiInputBase-input': { color: 'white' }
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={() => setFormData({
                ...formData,
                artists: [...formData.artists, {
                  name: '',
                  genre: '',
                  description: '',
                  image: '',
                  social: {
                    instagram: '',
                    facebook: '',
                    youtube: '',
                    twitter: ''
                  }
                }]
              })}
              variant="outlined"
              sx={{
                mt: 2,
                color: 'primary.main',
                borderColor: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.light',
                  backgroundColor: 'rgba(33, 150, 243, 0.08)',
                },
              }}
            >
              Add Another Artist
            </Button>
          </Box>

          {/* Ticket Types Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', mb: 2 }}>
              Ticket Types
            </Typography>
            {formData.ticketTypes.map((ticket, index) => (
              <Box
                key={index}
                sx={{
                  mb: 3,
                  p: 3,
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 2
                }}
              >
                <Typography variant="subtitle1" gutterBottom>
                  Ticket Type {index + 1}
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      label="Ticket Name *"
                      value={ticket.type}
                      onChange={(e) => {
                        const newTickets = [...formData.ticketTypes];
                        newTickets[index].type = e.target.value;
                        setFormData({ ...formData, ticketTypes: newTickets });
                      }}
                      required
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                          '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                          '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                        '& .MuiInputBase-input': { color: 'white' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Price (NPR) *"
                      type="number"
                      value={ticket.price}
                      onChange={(e) => {
                        const newTickets = [...formData.ticketTypes];
                        newTickets[index].price = e.target.value;
                        setFormData({ ...formData, ticketTypes: newTickets });
                      }}
                      required
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                          '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                          '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                        '& .MuiInputBase-input': { color: 'white' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Quantity Available *"
                      type="number"
                      value={ticket.quantity}
                      onChange={(e) => {
                        const newTickets = [...formData.ticketTypes];
                        newTickets[index].quantity = e.target.value;
                        setFormData({ ...formData, ticketTypes: newTickets });
                      }}
                      required
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                          '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                          '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                        '& .MuiInputBase-input': { color: 'white' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Description"
                      value={ticket.description}
                      onChange={(e) => {
                        const newTickets = [...formData.ticketTypes];
                        newTickets[index].description = e.target.value;
                        setFormData({ ...formData, ticketTypes: newTickets });
                      }}
                      fullWidth
                      multiline
                      rows={2}
                      helperText="Describe what's included with this ticket type"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                          '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                          '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                        '& .MuiInputBase-input': { color: 'white' },
                        '& .MuiFormHelperText-root': { color: 'rgba(255, 255, 255, 0.5)' }
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={() => setFormData({
                ...formData,
                ticketTypes: [...formData.ticketTypes, {
                  type: '',
                  price: '',
                  quantity: '',
                  description: ''
                }]
              })}
              variant="outlined"
              sx={{
                mt: 2,
                color: 'primary.main',
                borderColor: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.light',
                  backgroundColor: 'rgba(33, 150, 243, 0.08)',
                },
              }}
            >
              Add Another Ticket Type
            </Button>
          </Box>

          {/* Event Image Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', mb: 2 }}>
              Event Image
            </Typography>
            <TextField
              label="Event Image URL"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              fullWidth
              helperText="Add an attractive image to showcase your event"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiInputBase-input': { color: 'white' },
                '& .MuiFormHelperText-root': { color: 'rgba(255, 255, 255, 0.5)' }
              }}
            />
          </Box>

          {/* Action Buttons */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              onClick={onClose}
              variant="outlined"
              sx={{ 
                borderColor: 'rgba(255, 255, 255, 0.23)',
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)'
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (event ? 'Update Event' : 'Create Event')}
            </Button>
          </Box>
        </LocalizationProvider>
      </DialogContent>
    </Dialog>
  );
};

export default AdminDashboard; 