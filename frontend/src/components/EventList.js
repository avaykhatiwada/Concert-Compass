import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  useTheme,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
  Divider,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  CalendarToday,
  LocationOn,
  AccessTime,
  Bookmark,
  BookmarkBorder,
  Person,
  DateRange,
  ArrowForward,
  Instagram,
  Facebook,
  YouTube,
  Twitter,
  MusicNote,
  Star,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

const EventCard = ({ event, onArtistClick, onBookTickets }) => {
  const theme = useTheme();
  const [isSaved, setIsSaved] = useState(false);
  const [showArtists, setShowArtists] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (!event) {
    return null;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return '#757575';
      case 'RUNNING':
        return '#4caf50';
      case 'PUBLISHED':
        return '#2196f3';
      case 'PENDING':
        return '#ff9800';
      case 'APPROVED':
        return '#4caf50';
      case 'REJECTED':
        return '#f44336';
      case 'CANCELLED':
        return '#d32f2f';
      default:
        return '#757575';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    const date = dayjs(dateString);
    return date.format('MMM D, YYYY');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: isHovered 
            ? '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(33, 150, 243, 0.2)' 
            : '0 10px 30px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: isHovered ? 'translateY(-12px) scale(1.02)' : 'translateY(0) scale(1)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 70%, rgba(0,0,0,0.8) 100%)',
            opacity: 0.6,
            zIndex: 1,
            pointerEvents: 'none',
          }
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="220"
            image={event.image || `https://source.unsplash.com/random/800x600/?concert,${event._id}`}
            alt={event.title || 'Event'}
            sx={{
              objectFit: 'cover',
              objectPosition: 'center',
              transition: 'all 0.5s ease',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              filter: isHovered ? 'brightness(1.1)' : 'brightness(0.9)',
            }}
            onError={(e) => {
              console.log("Image failed to load:", event.image?.substring(0, 30) + "...");
              e.target.src = `https://source.unsplash.com/random/800x600/?concert,${event._id}`;
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              zIndex: 2,
            }}
          >
            <Chip
              label={event.status || 'PUBLISHED'}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: getStatusColor(event.status),
                fontWeight: 'bold',
                backdropFilter: 'blur(4px)',
                border: `1px solid ${getStatusColor(event.status)}`,
                boxShadow: `0 0 10px rgba(0, 0, 0, 0.3)`,
                '& .MuiChip-label': {
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                },
              }}
            />
            <IconButton
              onClick={() => setIsSaved(!isSaved)}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(4px)',
                color: isSaved ? theme.palette.primary.main : 'white',
                width: 36,
                height: 36,
                '&:hover': { 
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: isSaved ? [1, 1.3, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                {isSaved ? (
                  <Bookmark sx={{ color: theme.palette.primary.main }} />
                ) : (
                  <BookmarkBorder sx={{ color: 'white' }} />
                )}
              </motion.div>
            </IconButton>
          </Box>
          
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
              padding: '16px',
              paddingTop: '40px',
              zIndex: 2,
            }}
          >
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                color: 'white',
                fontWeight: 700,
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {event.title || 'Untitled Event'}
            </Typography>
          </Box>
        </Box>
        
        <CardContent sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          p: 2.5,
          pt: 2,
        }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip
              icon={<CalendarToday fontSize="small" sx={{ color: 'rgba(33, 150, 243, 0.8)' }} />}
              label={event.date ? formatDate(event.date) : 'Date TBA'}
              size="small"
              sx={{ 
                backgroundColor: 'rgba(33, 150, 243, 0.1)', 
                border: '1px solid rgba(33, 150, 243, 0.2)',
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 500,
                '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.15)' },
              }}
            />
            <Chip
              icon={<AccessTime fontSize="small" sx={{ color: 'rgba(0, 200, 83, 0.8)' }} />}
              label={event.time || 'Time TBA'}
              size="small"
              sx={{ 
                backgroundColor: 'rgba(0, 200, 83, 0.1)', 
                border: '1px solid rgba(0, 200, 83, 0.2)',
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 500,
                '&:hover': { backgroundColor: 'rgba(0, 200, 83, 0.15)' },
              }}
            />
            <Chip
              icon={<LocationOn fontSize="small" sx={{ color: 'rgba(233, 30, 99, 0.8)' }} />}
              label={event.venue?.name || event.location || 'Location TBA'}
              size="small"
              sx={{ 
                backgroundColor: 'rgba(233, 30, 99, 0.1)', 
                border: '1px solid rgba(233, 30, 99, 0.2)',
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 500,
                '&:hover': { backgroundColor: 'rgba(233, 30, 99, 0.15)' },
              }}
            />
          </Box>
          
          <Typography
            variant="body2"
            sx={{ 
              mb: 2.5, 
              color: 'rgba(255, 255, 255, 0.7)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.6,
              fontSize: '0.9rem',
            }}
          >
            {event.description || 'No description available'}
          </Typography>
          
          <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {Array.isArray(event.artists) && event.artists.length > 0 && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={() => setShowArtists(true)}
                  sx={{ 
                    borderRadius: 8,
                    borderColor: 'rgba(33, 150, 243, 0.5)',
                    color: '#90caf9',
                    textTransform: 'none',
                    py: 1,
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#90caf9',
                      backgroundColor: 'rgba(33, 150, 243, 0.08)',
                      boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)',
                    },
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  endIcon={<ArrowForward />}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Person sx={{ mr: 1 }} />
                    {event.artists.length > 1 
                      ? `View ${event.artists.length} Artists` 
                      : 'View Artist'}
                  </Box>
                </Button>
              </motion.div>
            )}
            
            {event.status !== 'COMPLETED' && (
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => onBookTickets(event)}
                  sx={{
                    borderRadius: 8,
                    textTransform: 'none',
                    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                    py: 1.2,
                    fontWeight: 600,
                    fontSize: '1rem',
                    boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <span>Book Tickets</span>
                    <Box sx={{ 
                      ml: 'auto', 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                      px: 1.5, 
                      py: 0.5, 
                      borderRadius: 4,
                      fontSize: '0.85rem',
                      fontWeight: 700,
                    }}>
                      Rs. {event.price || 0}
                    </Box>
                  </Box>
                </Button>
              </motion.div>
            )}
          </Box>
        </CardContent>

        <Dialog
          open={showArtists}
          onClose={() => setShowArtists(false)}
          maxWidth="md"
          fullWidth
          disablePortal={false}
          container={document.body}
          aria-labelledby="artist-dialog-title"
          PaperProps={{
            sx: {
              background: 'rgba(18, 18, 18, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '16px',
            },
          }}
        >
          <DialogTitle id="artist-dialog-title" sx={{ 
            textAlign: 'center', 
            fontSize: '1.75rem',
            fontWeight: 700,
            background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 3
          }}>
            Featured Artists
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              {event.artists?.map((artist) => {
                const artistId = artist._id || artist.id;
                console.log('Artist data:', { artist, id: artistId });
                return (
                  <Grid item xs={12} key={artistId}>
                    <Box sx={{
                      p: 3,
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      mb: 2
                    }}>
                      {/* Artist Header with Image and Name */}
                      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                        <Box
                          component="img"
                          src={artist.image || `https://source.unsplash.com/random/200x200/?artist,${artistId}`}
                          alt={artist.name}
                          sx={{
                            width: 120,
                            height: 120,
                            borderRadius: '8px',
                            objectFit: 'cover',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                          }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h4" sx={{ 
                            color: 'white',
                            fontWeight: 600,
                            mb: 1
                          }}>
                            {artist.name}
                          </Typography>
                          <Typography variant="h6" sx={{ 
                            color: 'rgba(255, 255, 255, 0.7)',
                            mb: 2
                          }}>
                            {artist.genre}
                          </Typography>
                          
                          {/* Social Media Links */}
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {artist.social?.instagram && (
                              <IconButton 
                                size="small" 
                                component="a" 
                                href={artist.social.instagram.startsWith('http') ? artist.social.instagram : `https://instagram.com/${artist.social.instagram}`}
                                target="_blank"
                                sx={{ 
                                  color: 'white',
                                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                  '&:hover': {
                                    backgroundColor: '#E1306C',
                                  }
                                }}
                              >
                                <Instagram fontSize="small" />
                              </IconButton>
                            )}
                            {artist.social?.facebook && (
                              <IconButton 
                                size="small" 
                                component="a" 
                                href={artist.social.facebook.startsWith('http') ? artist.social.facebook : `https://facebook.com/${artist.social.facebook}`}
                                target="_blank"
                                sx={{ 
                                  color: 'white',
                                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                  '&:hover': {
                                    backgroundColor: '#4267B2',
                                  }
                                }}
                              >
                                <Facebook fontSize="small" />
                              </IconButton>
                            )}
                            {artist.social?.youtube && (
                              <IconButton 
                                size="small" 
                                component="a" 
                                href={artist.social.youtube.startsWith('http') ? artist.social.youtube : `https://youtube.com/${artist.social.youtube}`}
                                target="_blank"
                                sx={{ 
                                  color: 'white',
                                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                  '&:hover': {
                                    backgroundColor: '#FF0000',
                                  }
                                }}
                              >
                                <YouTube fontSize="small" />
                              </IconButton>
                            )}
                            {artist.social?.twitter && (
                              <IconButton 
                                size="small" 
                                component="a" 
                                href={artist.social.twitter.startsWith('http') ? artist.social.twitter : `https://twitter.com/${artist.social.twitter}`}
                                target="_blank"
                                sx={{ 
                                  color: 'white',
                                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                  '&:hover': {
                                    backgroundColor: '#1DA1F2',
                                  }
                                }}
                              >
                                <Twitter fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                        </Box>
                      </Box>
                      
                      {/* Artist Bio */}
                      {artist.description && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="h6" sx={{ 
                            color: '#90caf9',
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}>
                            <Person fontSize="small" /> Biography
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            {artist.description}
                          </Typography>
                        </Box>
                      )}
                      
                      <Grid container spacing={3}>
                        {/* Popular Songs */}
                        {artist.popularSongs && artist.popularSongs.filter(song => song.trim()).length > 0 && (
                          <Grid item xs={12} md={6}>
                            <Box>
                              <Typography variant="h6" sx={{ 
                                color: '#90caf9',
                                mb: 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}>
                                <MusicNote fontSize="small" /> Popular Songs
                              </Typography>
                              <Box sx={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '8px',
                                p: 2
                              }}>
                                {artist.popularSongs.filter(song => song.trim()).map((song, idx) => (
                                  <Box key={idx} sx={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    p: 1,
                                    borderBottom: idx < artist.popularSongs.filter(s => s.trim()).length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                                  }}>
                                    <MusicNote fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.5)', mr: 1 }} />
                                    <Typography variant="body1" sx={{ color: 'white' }}>
                                      {song}
                                    </Typography>
                                  </Box>
                                ))}
                              </Box>
                            </Box>
                          </Grid>
                        )}
                        
                        {/* Achievements */}
                        {artist.achievements && artist.achievements.filter(achievement => achievement.trim()).length > 0 && (
                          <Grid item xs={12} md={6}>
                            <Box>
                              <Typography variant="h6" sx={{ 
                                color: '#90caf9',
                                mb: 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}>
                                <Star fontSize="small" /> Achievements
                              </Typography>
                              <Box sx={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '8px',
                                p: 2
                              }}>
                                {artist.achievements.filter(achievement => achievement.trim()).map((achievement, idx) => (
                                  <Box key={idx} sx={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    p: 1,
                                    borderBottom: idx < artist.achievements.filter(a => a.trim()).length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                                  }}>
                                    <Star fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.5)', mr: 1 }} />
                                    <Typography variant="body1" sx={{ color: 'white' }}>
                                      {achievement}
                                    </Typography>
                                  </Box>
                                ))}
                              </Box>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            console.log('Navigating to artist:', artistId);
                            setShowArtists(false);
                            onArtistClick(artist);
                          }}
                          sx={{
                            borderRadius: '8px',
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            '&:hover': {
                              borderColor: 'primary.main',
                              backgroundColor: 'rgba(33, 150, 243, 0.1)',
                            },
                          }}
                        >
                          View Artist Profile
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pt: 2 }}>
            <Button 
              onClick={() => setShowArtists(false)}
              variant="contained"
              sx={{
                borderRadius: '8px',
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                px: 4
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </motion.div>
  );
};

const BookingDialog = ({ open, onClose, event, onBookingComplete, isLoading, error: externalError }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [ticketCount, setTicketCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [walletBalance, setWalletBalance] = useState(5000); // Mock wallet balance
  const [internalError, setInternalError] = useState(null);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });

  const totalAmount = event.price * ticketCount;
  const canPayWithWallet = walletBalance >= totalAmount;

  // Use external error if provided, otherwise use internal error
  const error = externalError || internalError;

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePersonalInfo = () => {
    if (!personalInfo.fullName.trim()) return "Full name is required";
    if (!personalInfo.email.trim()) return "Email is required";
    if (!personalInfo.email.includes('@')) return "Please enter a valid email";
    if (!personalInfo.phone.trim()) return "Phone number is required";
    return null;
  };

  const handleNext = () => {
    setInternalError(null);
    
    if (activeStep === 0) {
      // Validate ticket count
      if (ticketCount > event.availableTickets) {
        setInternalError(`Only ${event.availableTickets} tickets available`);
        return;
      }
      setActiveStep(1);
    } else if (activeStep === 1) {
      // Validate personal information
      const personalInfoError = validatePersonalInfo();
      if (personalInfoError) {
        setInternalError(personalInfoError);
        return;
      }
      setActiveStep(2);
    } else if (activeStep === 2) {
      // Process payment
      try {
        if (paymentMethod === 'wallet') {
          if (!canPayWithWallet) {
            setInternalError('Insufficient wallet balance');
            return;
          }
          setWalletBalance(prev => prev - totalAmount);
        }
        
        // Create booking object with personal information
        onBookingComplete({
          event,
          ticketCount,
          totalAmount,
          paymentMethod,
          date: new Date().toISOString(),
          customerInfo: personalInfo
        });
        
        // Don't close the dialog here, it will be closed after successful booking
      } catch (error) {
        setInternalError('Payment processing failed. Please try again.');
      }
    }
  };

  const handleBack = () => {
    setInternalError(null);
    setActiveStep(prev => prev - 1);
  };

  const steps = ['Select Tickets', 'Personal Information', 'Payment Method'];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disablePortal={false}
      container={document.body}
      aria-labelledby="booking-dialog-title"
      aria-describedby="booking-dialog-description"
      PaperProps={{
        sx: {
          background: 'rgba(18, 18, 18, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <DialogTitle id="booking-dialog-title">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Book Tickets - {event.title}</Typography>
          <Chip
            label={`${event.availableTickets} tickets left`}
            color="primary"
            size="small"
          />
        </Box>
      </DialogTitle>
      <DialogContent id="booking-dialog-description">
        <Stepper activeStep={activeStep} sx={{ my: 3 }} aria-label="Booking process steps">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} role="alert">
            {error}
          </Alert>
        )}

        {activeStep === 0 && (
          <Box sx={{ mt: 2 }} role="form" aria-label="Select Tickets">
            <TextField
              label="Number of Tickets"
              type="number"
              value={ticketCount}
              onChange={(e) => {
                const value = Math.max(1, Math.min(parseInt(e.target.value) || 1, event.availableTickets));
                setTicketCount(value);
              }}
              fullWidth
              InputProps={{
                inputProps: { 
                  min: 1, 
                  max: event.availableTickets,
                  'aria-label': 'Number of tickets'
                },
              }}
              helperText={`Maximum ${event.availableTickets} tickets per booking`}
            />
            <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Price per ticket: ₨ {event.price}
              </Typography>
              <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                Total Amount: ₨ {totalAmount}
              </Typography>
            </Box>
          </Box>
        )}

        {activeStep === 1 && (
          <Box sx={{ mt: 2 }} role="form" aria-label="Enter Personal Information">
            <Typography variant="subtitle1" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
              Please provide your contact information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="fullName"
                  label="Full Name"
                  value={personalInfo.fullName}
                  onChange={handlePersonalInfoChange}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="email"
                  label="Email Address"
                  type="email"
                  value={personalInfo.email}
                  onChange={handlePersonalInfoChange}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="phone"
                  label="Phone Number"
                  value={personalInfo.phone}
                  onChange={handlePersonalInfoChange}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="address"
                  label="Address"
                  value={personalInfo.address}
                  onChange={handlePersonalInfoChange}
                  fullWidth
                  multiline
                  rows={2}
                  sx={{ mb: 2 }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {activeStep === 2 && (
          <Box sx={{ mt: 2 }} role="form" aria-label="Select Payment Method">
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">Select Payment Method</FormLabel>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                aria-label="payment method selection"
              >
                <FormControlLabel
                  value="wallet"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography>Wallet Balance</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Available: ₨ {walletBalance}
                      </Typography>
                    </Box>
                  }
                  disabled={!canPayWithWallet}
                />
                <FormControlLabel
                  value="esewa"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography>eSewa</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Pay securely with eSewa
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="khalti"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography>Khalti</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Pay securely with Khalti
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>

            {!canPayWithWallet && paymentMethod === 'wallet' && (
              <Alert severity="warning" sx={{ mt: 2 }} role="alert">
                Insufficient wallet balance. Please add funds or choose a different payment method.
              </Alert>
            )}

            <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Payment Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">Tickets ({ticketCount})</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" align="right">
                    ₨ {totalAmount}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Total Amount</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="primary" align="right">
                    ₨ {totalAmount}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 3 }}>
        {activeStep > 0 && (
          <Button 
            onClick={handleBack}
            variant="outlined"
            disabled={isLoading}
            sx={{
              borderRadius: '8px',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
              },
            }}
          >
            Back
          </Button>
        )}
        {activeStep === 0 && (
          <Button 
            onClick={onClose}
            variant="outlined"
            disabled={isLoading}
            sx={{
              borderRadius: '8px',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
              },
            }}
          >
            Cancel
          </Button>
        )}
        <Button
          onClick={handleNext}
          variant="contained"
          disabled={isLoading}
          sx={{
            borderRadius: '8px',
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            px: 4,
            position: 'relative',
          }}
        >
          {isLoading ? (
            <>
              <CircularProgress size={24} sx={{ color: 'white', position: 'absolute' }} />
              <span style={{ visibility: 'hidden' }}>
                {activeStep === steps.length - 1 ? 'Complete Booking' : 'Next'}
              </span>
            </>
          ) : (
            activeStep === steps.length - 1 ? 'Complete Booking' : 'Next'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Receipt Dialog Component
const ReceiptDialog = ({ open, onClose, booking }) => {
  const receiptRef = React.useRef();

  // Guard clause for null booking
  if (!booking) return null;

  // Extract payment method safely
  const paymentMethod = booking.payment?.method || booking.paymentMethod || 'N/A';
  const transactionId = booking.payment?.transactionId || booking.transactionId || 'N/A';
  const customerInfo = booking.customer || booking.customerInfo || {};
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disablePortal={false}
      container={document.body}
      aria-labelledby="receipt-dialog-title"
      aria-describedby="receipt-dialog-description"
      PaperProps={{
        sx: {
          background: 'rgba(18, 18, 18, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <DialogTitle id="receipt-dialog-title">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Booking Confirmation</Typography>
          <Typography variant="body2" color="primary">
            #{booking.bookingId || 'N/A'}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent id="receipt-dialog-description">
        <Box sx={{ p: 2 }} ref={receiptRef} role="document" aria-label="Booking receipt">
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              {booking.event?.title || 'Event'}
            </Typography>
            <Chip
              icon={<CalendarToday fontSize="small" />}
              label={booking.event?.date ? dayjs(booking.event.date).format('MMM D, YYYY') : 'Date not available'}
              sx={{ mr: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            />
            <Chip
              icon={<AccessTime fontSize="small" />}
              label={booking.event?.time || 'Time not available'}
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            />
          </Box>

          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              mb: 3, 
              borderRadius: 2, 
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'white' }}>
              Customer Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Full Name
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {customerInfo.fullName || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {customerInfo.email || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {customerInfo.phone || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Address
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {typeof customerInfo.address === 'object' 
                    ? `${customerInfo.address.street || ''}, ${customerInfo.address.city || ''}, ${customerInfo.address.state || ''} ${customerInfo.address.zipCode || ''}`
                    : customerInfo.address || 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              mb: 3, 
              borderRadius: 2, 
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'white' }}>
              Ticket Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Tickets
                </Typography>
                <Typography variant="body1">
                  {booking.ticketCount || 0} x Rs. {booking.event?.price || 0}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Total Amount
                </Typography>
                <Typography variant="h6" color="primary">
                  Rs. {booking.totalAmount || 0}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              mb: 3, 
              borderRadius: 2, 
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'white' }}>
              Payment Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Payment Method
                </Typography>
                <Typography variant="body1">
                  {paymentMethod ? paymentMethod.toUpperCase() : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Transaction ID
                </Typography>
                <Typography variant="body1">
                  {transactionId}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Payment Date
                </Typography>
                <Typography variant="body1">
                  {booking.payment?.date ? dayjs(booking.payment.date).format('MMM D, YYYY, h:mm A') : 
                   booking.date ? dayjs(booking.date).format('MMM D, YYYY, h:mm A') : 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              mb: 3, 
              borderRadius: 2, 
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'white' }}>
              Venue Information
            </Typography>
            <Typography variant="body1">
              {typeof booking.event?.venue === 'object' 
                ? booking.event.venue.name || 'Venue not available'
                : typeof booking.event?.location === 'object'
                  ? `${booking.event.location.name || ''}`
                  : booking.event?.venue || booking.event?.location || 'Location not available'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {typeof booking.event?.venue === 'object' && booking.event.venue.address
                ? typeof booking.event.venue.address === 'object'
                  ? `${booking.event.venue.address.street || ''}, ${booking.event.venue.address.city || ''}, ${booking.event.venue.address.state || ''} ${booking.event.venue.address.zipCode || ''}`
                  : booking.event.venue.address
                : typeof booking.event?.location === 'object' && booking.event.location.address
                  ? typeof booking.event.location.address === 'object'
                    ? `${booking.event.location.address.street || ''}, ${booking.event.location.address.city || ''}, ${booking.event.location.address.state || ''} ${booking.event.location.address.zipCode || ''}`
                    : booking.event.location.address
                  : 'Address information not available'}
            </Typography>
          </Paper>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Please show this receipt at the venue
            </Typography>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Booking Date: {dayjs().format('MMM D, YYYY, h:mm A')}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} aria-label="Close receipt">Close</Button>
        <Button
          variant="contained"
          onClick={() => {
            window.print();
          }}
          aria-label="Download or print receipt"
        >
          Download Receipt
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const EventList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/events/public', {
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }

        const data = await response.json();
        console.log('Fetched events:', data);
        
        // Validate and log artist data from events
        const validatedEvents = data.map(event => {
          if (event.artists && Array.isArray(event.artists)) {
            // Log each artist's data for debugging
            event.artists.forEach(artist => {
              if (artist && artist._id) {
                console.log(`Valid artist data found for ${event.title}:`, {
                  id: artist._id,
                  name: artist.name,
                  genre: artist.genre
                });
              } else {
                console.warn(`Invalid artist data found in event ${event.title}:`, artist);
              }
            });

            // Filter out any invalid artist entries
            event.artists = event.artists.filter(artist => artist && artist._id);
          } else {
            console.warn(`No artists array found for event ${event.title}`);
            event.artists = [];
          }

          // Determine event status based on date
          const eventDate = dayjs(event.date);
          const today = dayjs();
          
          if (eventDate.isBefore(today, 'day')) {
            event.status = 'COMPLETED';
          } else if (eventDate.isSame(today, 'day')) {
            event.status = 'RUNNING';
          } else {
            event.status = 'PUBLISHED';
          }
          
          return event;
        });

        setEvents(validatedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleArtistClick = (artist) => {
    if (!artist) {
      console.error('No artist data provided');
      return;
    }

    // Check if we received an event object instead of an artist object
    if (artist.artists && Array.isArray(artist.artists)) {
      console.error('Received event object instead of artist object:', artist);
      // We can't determine which artist to show, so return
      return;
    }

    const artistId = artist._id || artist.id;
    if (!artistId) {
      console.error('Invalid artist data - no ID found:', artist);
      return;
    }

    // Log the full artist data for debugging
    console.log('Artist data before navigation:', {
      id: artistId,
      name: artist.name,
      genre: artist.genre,
      image: artist.image,
      bio: artist.bio,
      _id: artist._id,
      rawId: artist.id
    });

    // Make sure we're using the correct ID format and navigate to the customer artist route
    const formattedId = artistId.toString();
    console.log('Navigating to artist with formatted ID:', formattedId);
    navigate(`/customer/artists/${formattedId}`);
  };

  const handleBookingComplete = async (bookingDetails) => {
    try {
      setBookingLoading(true);
      setBookingError(null);
      
      console.log('Processing booking for event:', bookingDetails.event.title);
      
      // Send booking data to backend
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: bookingDetails.event._id,
          customerInfo: bookingDetails.customerInfo,
          ticketCount: bookingDetails.ticketCount,
          totalAmount: bookingDetails.totalAmount,
          paymentMethod: bookingDetails.paymentMethod,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create booking');
      }
      
      const savedBooking = await response.json();
      console.log('Booking created successfully:', savedBooking);
      
      // Update events list to reflect the new available tickets count
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event._id === bookingDetails.event._id 
            ? { ...event, availableTickets: event.availableTickets - bookingDetails.ticketCount } 
            : event
        )
      );
      
      // Combine the saved booking data with the event details for display
      const completeBooking = {
        ...savedBooking,
        event: bookingDetails.event, // Include the full event object for display
        customerInfo: savedBooking.customer || bookingDetails.customerInfo, // Handle different property names
        ticketCount: savedBooking.ticketCount || bookingDetails.ticketCount,
        totalAmount: savedBooking.totalAmount || bookingDetails.totalAmount,
        paymentMethod: savedBooking.payment?.method || bookingDetails.paymentMethod,
        date: savedBooking.payment?.date || savedBooking.createdAt || new Date().toISOString()
      };
      
      console.log('Complete booking object for receipt:', completeBooking);
      
      // Set the current booking with combined data
      setCurrentBooking(completeBooking);
      
      // Show receipt and close booking dialog
      setShowReceipt(true);
      setShowBooking(false);
    } catch (error) {
      console.error('Error creating booking:', error);
      setBookingError(error.message);
      // Show error to user but keep dialog open
    } finally {
      setBookingLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return '#757575';
      case 'RUNNING':
        return '#4caf50';
      case 'PUBLISHED':
        return '#2196f3';
      case 'PENDING':
        return '#ff9800';
      case 'APPROVED':
        return '#4caf50';
      case 'REJECTED':
        return '#f44336';
      case 'CANCELLED':
        return '#d32f2f';
      default:
        return '#757575';
    }
  };

  const filteredEvents = events.filter(event => {
    switch (tabValue) {
      case 0: // All
        return true;
      case 1: // Upcoming
        return event.status === 'PUBLISHED';
      case 2: // Running
        return event.status === 'RUNNING';
      case 3: // Completed
        return event.status === 'COMPLETED';
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <Container>
        <Typography>Loading events...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{
          color: 'white',
          fontWeight: 700,
          textAlign: 'center',
          mb: 4,
        }}
      >
        Events in Nepal
      </Typography>

      <Tabs
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        centered
        sx={{
          mb: 4,
          '& .MuiTab-root': {
            color: 'rgba(255, 255, 255, 0.7)',
            '&.Mui-selected': {
              color: 'primary.main',
            },
          },
        }}
      >
        <Tab label="All Events" />
        <Tab label="Upcoming" />
        <Tab label="Running" />
        <Tab label="Completed" />
      </Tabs>

      <Grid container spacing={4}>
        {filteredEvents.map((event) => (
          <Grid item key={event._id} xs={12} sm={6} md={4}>
            <EventCard
              event={event}
              onArtistClick={handleArtistClick}
              onBookTickets={(event) => {
                setSelectedEvent(event);
                setShowBooking(true);
              }}
            />
          </Grid>
        ))}
      </Grid>

      {selectedEvent && (
        <BookingDialog
          open={showBooking}
          onClose={() => setShowBooking(false)}
          event={selectedEvent}
          onBookingComplete={handleBookingComplete}
          isLoading={bookingLoading}
          error={bookingError}
        />
      )}

      <ReceiptDialog
        open={showReceipt}
        onClose={() => setShowReceipt(false)}
        booking={currentBooking}
      />
    </Container>
  );
};

export default EventList; 