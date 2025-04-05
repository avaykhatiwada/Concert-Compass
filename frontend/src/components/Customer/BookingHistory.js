import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled,
  useTheme,
  CircularProgress,
  Alert,
  Paper,
  Divider,
} from '@mui/material';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import DownloadIcon from '@mui/icons-material/Download';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import {
  CalendarToday,
  LocationOn,
  ConfirmationNumber,
  Person,
  Phone,
  Email,
  Home,
  Payment,
  AccessTime,
} from '@mui/icons-material';

const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2), 0 0 10px rgba(33, 150, 243, 0.3)',
  },
}));

const StyledChip = styled(Chip)(({ theme, status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return '#4caf50';
      case 'CANCELLED':
        return '#f44336';
      case 'ATTENDED':
        return '#2196f3';
      case 'NO_SHOW':
        return '#ff9800';
      default:
        return theme.palette.primary.main;
    }
  };

  return {
    backgroundColor: `${getStatusColor(status)}20`,
    color: getStatusColor(status),
    fontWeight: 600,
    '& .MuiChip-label': {
      padding: '0 12px',
    },
  };
});

const BookingHistory = () => {
  const theme = useTheme();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/bookings/my-bookings', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const data = await response.json();
        setBookings(data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleViewQR = (booking) => {
    setSelectedBooking(booking);
    setQrDialogOpen(true);
  };

  const handleDownloadTicket = (booking) => {
    // Implement ticket download functionality
    console.log('Downloading ticket for booking:', booking._id);
  };

  const handleViewEvent = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#4caf50';
      case 'cancelled':
        return '#f44336';
      case 'attended':
        return '#2196f3';
      default:
        return '#757575';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'cancelled':
        return 'Cancelled';
      case 'attended':
        return 'Attended';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh',
        flexDirection: 'column',
        gap: 3
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>
          Loading your bookings...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}>
          <Typography variant="h5" color="error" gutterBottom>
            Error loading bookings
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Box>
      </Container>
    );
  }

  if (bookings.length === 0) {
    return (
      <Container>
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3
        }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            My Bookings
          </Typography>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              borderRadius: 4, 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              maxWidth: 500,
              mx: 'auto'
            }}
          >
            <Typography variant="h6" gutterBottom>
              No bookings found
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.7)' }}>
              You haven't made any bookings yet. Explore our events and book your tickets!
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/events')}
              sx={{ 
                borderRadius: 8,
                textTransform: 'none',
                py: 1.2,
                px: 3,
                fontWeight: 600
              }}
            >
              Explore Events
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 700,
          background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 4,
        }}
      >
        My Bookings
      </Typography>

      <Grid container spacing={3}>
        {bookings.map((booking) => (
          <Grid item xs={12} key={booking._id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard>
                <CardContent sx={{ p: 0 }}>
                  <Grid container>
                    <Grid item xs={12} md={4} sx={{ 
                      position: 'relative',
                      minHeight: { xs: 200, md: '100%' }
                    }}>
                      <Box
                        component="img"
                        src={booking.event?.image || `https://source.unsplash.com/random/800x600/?concert,${booking._id}`}
                        alt={booking.event?.title || 'Event'}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          position: { md: 'absolute' },
                          top: 0,
                          left: 0,
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          zIndex: 1,
                        }}
                      >
                        <Chip
                          label={getStatusLabel(booking.status)}
                          sx={{
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            color: getStatusColor(booking.status),
                            fontWeight: 'bold',
                            backdropFilter: 'blur(4px)',
                            border: `1px solid ${getStatusColor(booking.status)}`,
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Box sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h5" gutterBottom>
                            {booking.event?.title || 'Event Title Not Available'}
                          </Typography>
                          <Typography variant="body2" color="primary">
                            #{booking.bookingId}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarToday sx={{ color: 'rgba(255, 255, 255, 0.6)', mr: 1, fontSize: '0.9rem' }} />
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              {booking.event?.date ? dayjs(booking.event.date).format('MMM D, YYYY') : 'Date not available'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccessTime sx={{ color: 'rgba(255, 255, 255, 0.6)', mr: 1, fontSize: '0.9rem' }} />
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              {booking.event?.time || 'Time not available'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationOn sx={{ color: 'rgba(255, 255, 255, 0.6)', mr: 1, fontSize: '0.9rem' }} />
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              {booking.event?.venue?.name || 'Venue not available'}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Paper 
                              elevation={0}
                              sx={{ 
                                p: 2, 
                                borderRadius: 2, 
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                height: '100%'
                              }}
                            >
                              <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                <ConfirmationNumber sx={{ mr: 1, fontSize: '1rem', color: 'primary.main' }} />
                                Ticket Details
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                  Tickets:
                                </Typography>
                                <Typography variant="body2">
                                  {booking.ticketCount}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                  Total Amount:
                                </Typography>
                                <Typography variant="body2" color="primary" fontWeight={600}>
                                  Rs. {booking.totalAmount}
                                </Typography>
                              </Box>
                            </Paper>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Paper 
                              elevation={0}
                              sx={{ 
                                p: 2, 
                                borderRadius: 2, 
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                height: '100%'
                              }}
                            >
                              <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                <Payment sx={{ mr: 1, fontSize: '1rem', color: 'primary.main' }} />
                                Payment Information
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                  Method:
                                </Typography>
                                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                  {booking.payment?.method || 'N/A'}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                  Date:
                                </Typography>
                                <Typography variant="body2">
                                  {booking.payment?.date ? dayjs(booking.payment.date).format('MMM D, YYYY') : 'N/A'}
                                </Typography>
                              </Box>
                            </Paper>
                          </Grid>
                        </Grid>
                        
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                              Booked on {dayjs(booking.createdAt).format('MMM D, YYYY, h:mm A')}
                            </Typography>
                          </Box>
                          <Box>
                            <Button 
                              variant="outlined" 
                              size="small"
                              onClick={() => handleViewEvent(booking.event?._id)}
                              sx={{ 
                                borderRadius: 8,
                                textTransform: 'none',
                                mr: 1
                              }}
                            >
                              View Event
                            </Button>
                            {booking.status === 'confirmed' && (
                              <Button 
                                variant="contained" 
                                size="small"
                                color="primary"
                                sx={{ 
                                  borderRadius: 8,
                                  textTransform: 'none'
                                }}
                              >
                                Download Ticket
                              </Button>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </GlassCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={qrDialogOpen}
        onClose={() => setQrDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        disablePortal={false}
        container={document.body}
        aria-labelledby="qr-dialog-title"
        PaperProps={{
          sx: {
            background: 'rgba(18, 18, 18, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <DialogTitle id="qr-dialog-title">Ticket QR Code</DialogTitle>
        <DialogContent>
          {selectedBooking?.qrCode && (
            <Box 
              sx={{ display: 'flex', justifyContent: 'center', p: 2 }}
              role="img"
              aria-label="Ticket QR Code for booking"
            >
              <img
                src={selectedBooking.qrCode}
                alt={`QR Code for booking ${selectedBooking._id}`}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setQrDialogOpen(false)}
            aria-label="Close QR code dialog"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookingHistory; 