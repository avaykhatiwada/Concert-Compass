import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  styled,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextareaAutosize,
  Paper,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Image as ImageIcon,
  CalendarToday,
  LocationOn,
  AccessTime,
  Person,
  AttachMoney,
  Category,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  border: '1px solid rgba(255, 255, 255, 0.1)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiInputBase-input': {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  '& .MuiFormHelperText-root': {
    color: 'rgba(255, 255, 255, 0.5)',
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    background: 'linear-gradient(to bottom right, rgba(25, 118, 210, 0.05), rgba(66, 165, 245, 0.05))',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: theme.spacing(2),
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontSize: '1.75rem',
  fontWeight: 700,
  textAlign: 'center',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(3, 0),
}));

const FormSection = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.03)',
  borderRadius: '12px',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  border: '1px solid rgba(255, 255, 255, 0.05)',
  '& .section-title': {
    color: theme.palette.primary.main,
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    '& .MuiSvgIcon-root': {
      fontSize: '1.2rem',
    },
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
  '& .MuiSelect-icon': {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  '& .MuiInputBase-input': {
    color: 'rgba(255, 255, 255, 0.9)',
  },
}));

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Nepali Rock Festival',
      description: 'A celebration of Nepali rock music featuring top bands.',
      date: '2024-08-15',
      time: '6:00 PM',
      location: 'Kathmandu',
      image: 'https://source.unsplash.com/random/800x600/?concert,1',
      status: 'PENDING',
      expectedCapacity: 5000,
      budget: 1500000,
      category: 'MUSIC',
    },
    // Add more event ideas
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: dayjs(),
    time: '18:00',
    location: '',
    image: '',
    expectedCapacity: '',
    budget: '',
    category: 'MUSIC',
  });

  const handleOpenDialog = (event = null) => {
    if (event) {
      setSelectedEvent(event);
      setFormData({
        ...event,
        date: dayjs(event.date),
      });
    } else {
      setSelectedEvent(null);
      setFormData({
        title: '',
        description: '',
        date: dayjs(),
        time: '18:00',
        location: '',
        image: '',
        expectedCapacity: '',
        budget: '',
        category: 'MUSIC',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
  };

  const handleSubmit = () => {
    if (selectedEvent) {
      // Update existing event
      setEvents(events.map(event => 
        event.id === selectedEvent.id 
          ? { ...formData, id: event.id, status: 'PENDING' }
          : event
      ));
    } else {
      // Add new event
      setEvents([
        ...events,
        {
          ...formData,
          id: Date.now(),
          status: 'PENDING',
          image: formData.image || `https://source.unsplash.com/random/800x600/?concert,${events.length + 1}`,
        },
      ]);
    }
    handleCloseDialog();
  };

  const handleDelete = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return '#4caf50';
      case 'PENDING':
        return '#ff9800';
      case 'REJECTED':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Event Ideas Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            borderRadius: 8,
          }}
        >
          New Event Idea
        </Button>
      </Box>

      <Grid container spacing={4}>
        {events.map((event) => (
          <Grid item key={event.id} xs={12} sm={6} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard>
                <CardMedia
                  component="img"
                  height="200"
                  image={event.image}
                  alt={event.title}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: 'flex',
                    gap: 1,
                  }}
                >
                  <Chip
                    label={event.status}
                    sx={{
                      backgroundColor: getStatusColor(event.status),
                      color: 'white',
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {event.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<CalendarToday fontSize="small" />}
                      label={dayjs(event.date).format('MMM D, YYYY')}
                      size="small"
                      sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    />
                    <Chip
                      icon={<AccessTime fontSize="small" />}
                      label={event.time}
                      size="small"
                      sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    />
                    <Chip
                      icon={<LocationOn fontSize="small" />}
                      label={event.location}
                      size="small"
                      sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {event.description}
                  </Typography>
                  <Box sx={{ mt: 'auto' }}>
                    <Typography variant="body2" color="text.secondary">
                      Expected Capacity: {event.expectedCapacity.toLocaleString()} people
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Budget: ₨ {event.budget.toLocaleString()}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(event)}
                        sx={{ color: 'primary.main' }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(event.id)}
                        sx={{ color: '#f44336' }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </GlassCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <StyledDialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <StyledDialogTitle>
          {selectedEvent ? 'Edit Event Idea' : 'Create New Event'}
        </StyledDialogTitle>
        <DialogContent>
          <FormSection>
            <Typography variant="h6" className="section-title">
              <Category fontSize="small" /> Basic Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <StyledTextField
                  label="Event Title"
                  fullWidth
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter a captivating title for your event"
                  helperText="Make it memorable and descriptive"
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your event in detail"
                  helperText="Include key highlights and what attendees can expect"
                />
              </Grid>
            </Grid>
          </FormSection>

          <FormSection>
            <Typography variant="h6" className="section-title">
              <CalendarToday fontSize="small" /> Date & Location
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="Event Date"
                  value={formData.date}
                  onChange={(newValue) => setFormData({ ...formData, date: newValue })}
                  renderInput={(params) => 
                    <StyledTextField 
                      {...params} 
                      fullWidth 
                      helperText="Select the date and time of your event"
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Time"
                  type="time"
                  fullWidth
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  helperText="Choose a suitable time"
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  label="Location"
                  fullWidth
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Enter the venue or location"
                  helperText="Provide a clear and accurate location"
                  InputProps={{
                    startAdornment: <LocationOn sx={{ color: 'rgba(255, 255, 255, 0.5)', mr: 1 }} />,
                  }}
                />
              </Grid>
            </Grid>
          </FormSection>

          <FormSection>
            <Typography variant="h6" className="section-title">
              <ImageIcon fontSize="small" /> Event Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Category</InputLabel>
                  <StyledSelect
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    label="Category"
                  >
                    <MenuItem value="MUSIC">🎵 Music</MenuItem>
                    <MenuItem value="SPORTS">⚽ Sports</MenuItem>
                    <MenuItem value="ARTS">🎨 Arts</MenuItem>
                    <MenuItem value="FOOD">🍽️ Food</MenuItem>
                    <MenuItem value="TECHNOLOGY">💻 Technology</MenuItem>
                    <MenuItem value="OTHER">✨ Other</MenuItem>
                  </StyledSelect>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Image URL"
                  fullWidth
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Enter an image URL for your event"
                  helperText="Add an attractive image to showcase your event"
                  InputProps={{
                    startAdornment: <ImageIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', mr: 1 }} />,
                  }}
                />
              </Grid>
            </Grid>
          </FormSection>

          <FormSection>
            <Typography variant="h6" className="section-title">
              <AttachMoney fontSize="small" /> Capacity & Budget
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Expected Capacity"
                  type="number"
                  fullWidth
                  value={formData.expectedCapacity}
                  onChange={(e) => setFormData({ ...formData, expectedCapacity: e.target.value })}
                  placeholder="Enter expected number of attendees"
                  helperText="Estimate the number of attendees"
                  InputProps={{
                    startAdornment: <Person sx={{ color: 'rgba(255, 255, 255, 0.5)', mr: 1 }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Budget (NPR)"
                  type="number"
                  fullWidth
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="Enter your event budget"
                  helperText="Set a realistic budget for your event"
                  InputProps={{
                    startAdornment: <span style={{ color: 'rgba(255, 255, 255, 0.5)', marginRight: '8px' }}>₨</span>,
                  }}
                />
              </Grid>
            </Grid>
          </FormSection>
        </DialogContent>
        <DialogActions sx={{ padding: 3, justifyContent: 'center', gap: 2 }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
              borderRadius: '8px',
              px: 4,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              borderRadius: '8px',
              px: 4,
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            {selectedEvent ? 'Update Event' : 'Create Event'}
          </Button>
        </DialogActions>
      </StyledDialog>
    </Container>
  );
};

export default OrganizerDashboard; 