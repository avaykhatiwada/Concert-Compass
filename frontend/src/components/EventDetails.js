import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { 
  Box, 
  Button, 
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress, 
  Container, 
  Grid, 
  List, 
  ListItem, 
  ListItemText, 
  Paper, 
  Typography 
} from '@mui/material';
import { 
  AccessTime,
  ArrowBack, 
  CalendarToday, 
  ConfirmationNumber, 
  DirectionsCar,
  ErrorOutline,
  EventSeat, 
  Info, 
  InfoOutlined, 
  LocationOn, 
  Person
} from '@mui/icons-material';
import dayjs from 'dayjs';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_URL } from '../../config';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/events/${id}`);
        setEvent(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('Failed to load event details. Please try again later.');
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleBookTickets = () => {
    navigate(`/book-tickets/${id}`);
  };

  const handleArtistClick = (artist) => {
    navigate(`/artists/${artist._id}`);
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
        <CircularProgress size={60} thickness={4} sx={{ color: theme.palette.primary.main }} />
        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>
          Loading event details...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh',
        flexDirection: 'column',
        gap: 3
      }}>
        <ErrorOutline sx={{ fontSize: 60, color: theme.palette.error.main }} />
        <Typography variant="h5" sx={{ color: 'rgba(255, 255, 255, 0.9)', textAlign: 'center' }}>
          {error}
        </Typography>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/events')}
          startIcon={<ArrowBack />}
          sx={{ 
            mt: 2,
            borderRadius: 8,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          Back to Events
        </Button>
      </Box>
    );
  }

  if (!event) {
    return null;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    const date = dayjs(dateString);
    return date.format('dddd, MMMM D, YYYY');
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <Button
            onClick={() => navigate('/events')}
            startIcon={<ArrowBack />}
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': { color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.05)' },
              borderRadius: 8,
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Back to Events
          </Button>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                  mb: 4,
                  height: { xs: '300px', sm: '400px', md: '500px' },
                }}
              >
                <Box
                  component="img"
                  src={event.image || `https://source.unsplash.com/random/1200x800/?concert,${event._id}`}
                  alt={event.title}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    filter: 'brightness(0.85)',
                  }}
                  onError={(e) => {
                    console.log("Image failed to load:", event.image?.substring(0, 30) + "...");
                    e.target.src = `https://source.unsplash.com/random/1200x800/?concert,${event._id}`;
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    p: { xs: 3, sm: 4 },
                  }}
                >
                  <Chip
                    label={event.status || 'PUBLISHED'}
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
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
                  <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                      color: 'white',
                      fontWeight: 800,
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                      mb: 1,
                      fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    }}
                  >
                    {event.title}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarToday sx={{ color: 'rgba(255, 255, 255, 0.8)', mr: 1, fontSize: '1.2rem' }} />
                      <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                        {formatDate(event.date)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccessTime sx={{ color: 'rgba(255, 255, 255, 0.8)', mr: 1, fontSize: '1.2rem' }} />
                      <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                        {event.time || 'Time TBA'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn sx={{ color: 'rgba(255, 255, 255, 0.8)', mr: 1, fontSize: '1.2rem' }} />
                    <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                      {event.venue?.name || event.location || 'Location TBA'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  mb: 4,
                }}
              >
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    mb: 3,
                    color: 'white',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Info sx={{ mr: 1.5, color: theme.palette.primary.main }} />
                  About This Event
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: 1.8,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {event.description || 'No description available for this event.'}
                </Typography>
              </Paper>
            </motion.div>

            {Array.isArray(event.artists) && event.artists.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    mb: 4,
                  }}
                >
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      mb: 3,
                      color: 'white',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Person sx={{ mr: 1.5, color: theme.palette.primary.main }} />
                    Featured Artists
                  </Typography>
                  <Grid container spacing={3}>
                    {event.artists.map((artist, index) => (
                      <Grid item xs={12} sm={6} md={4} key={artist._id || index}>
                        <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ duration: 0.2 }}>
                          <Card
                            sx={{
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              background: 'rgba(255, 255, 255, 0.08)',
                              backdropFilter: 'blur(10px)',
                              borderRadius: 3,
                              overflow: 'hidden',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 10px rgba(33, 150, 243, 0.3)',
                              },
                            }}
                            onClick={() => handleArtistClick(artist)}
                          >
                            <CardMedia
                              component="img"
                              height="180"
                              image={artist.image || `https://source.unsplash.com/random/300x300/?artist,${artist._id || index}`}
                              alt={artist.name}
                              sx={{
                                objectFit: 'cover',
                                objectPosition: 'center',
                              }}
                              onError={(e) => {
                                e.target.src = `https://source.unsplash.com/random/300x300/?artist,${artist._id || index}`;
                              }}
                            />
                            <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                              <Typography
                                variant="h6"
                                component="h3"
                                sx={{
                                  color: 'white',
                                  fontWeight: 600,
                                  mb: 1,
                                  textAlign: 'center',
                                }}
                              >
                                {artist.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  textAlign: 'center',
                                  mb: 2,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                }}
                              >
                                {artist.genre || 'Various Genres'}
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  sx={{
                                    borderRadius: 8,
                                    textTransform: 'none',
                                    px: 2,
                                    borderColor: 'rgba(33, 150, 243, 0.5)',
                                    color: '#90caf9',
                                    '&:hover': {
                                      borderColor: '#90caf9',
                                      backgroundColor: 'rgba(33, 150, 243, 0.08)',
                                    },
                                  }}
                                >
                                  View Profile
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </motion.div>
            )}
          </Grid>

          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  mb: 4,
                  position: 'sticky',
                  top: 100,
                }}
              >
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    mb: 3,
                    color: 'white',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <ConfirmationNumber sx={{ mr: 1.5, color: theme.palette.primary.main }} />
                  Ticket Information
                </Typography>

                {Array.isArray(event.ticketTypes) && event.ticketTypes.length > 0 ? (
                  <>
                    <List sx={{ mb: 3 }}>
                      {event.ticketTypes.map((ticket, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index, duration: 0.3 }}
                        >
                          <ListItem
                            sx={{
                              mb: 2,
                              background: 'rgba(255, 255, 255, 0.08)',
                              borderRadius: 3,
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                background: 'rgba(255, 255, 255, 0.12)',
                                transform: 'translateY(-4px)',
                                boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
                              },
                            }}
                          >
                            <ListItemText
                              primary={
                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                                  {ticket.name}
                                </Typography>
                              }
                              secondary={
                                <Box sx={{ mt: 1 }}>
                                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    {ticket.description || 'Standard admission'}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <EventSeat sx={{ color: 'rgba(255, 255, 255, 0.5)', mr: 1, fontSize: '0.9rem' }} />
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                      {ticket.quantity} seats available
                                    </Typography>
                                  </Box>
                                </Box>
                              }
                            />
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography
                                variant="h6"
                                sx={{
                                  color: theme.palette.primary.main,
                                  fontWeight: 700,
                                }}
                              >
                                Rs. {ticket.price}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: 'rgba(255, 255, 255, 0.5)',
                                  display: 'block',
                                  mt: 0.5,
                                }}
                              >
                                per ticket
                              </Typography>
                            </Box>
                          </ListItem>
                        </motion.div>
                      ))}
                    </List>

                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          mb: 1,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <InfoOutlined sx={{ fontSize: '0.9rem', mr: 1 }} />
                        Prices are inclusive of all taxes
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <InfoOutlined sx={{ fontSize: '0.9rem', mr: 1 }} />
                        Additional booking fees may apply
                      </Typography>
                    </Box>

                    {event.status !== 'COMPLETED' && (
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={handleBookTickets}
                          sx={{
                            borderRadius: 8,
                            textTransform: 'none',
                            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                            py: 1.5,
                            fontWeight: 600,
                            fontSize: '1.1rem',
                            boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                            '&:hover': {
                              boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)',
                            },
                          }}
                          startIcon={<ConfirmationNumber />}
                        >
                          Book Tickets Now
                        </Button>
                      </motion.div>
                    )}
                  </>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                      Ticket information is not available yet.
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      Please check back later for updates.
                    </Typography>
                  </Box>
                )}
              </Paper>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    mb: 3,
                    color: 'white',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <LocationOn sx={{ mr: 1.5, color: theme.palette.primary.main }} />
                  Venue Information
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                    {event.venue?.name || event.location || 'Venue TBA'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                    {event.venue?.address || 'Address information not available'}
                  </Typography>
                  <Box
                    sx={{
                      height: 200,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 2,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      Map view not available
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <DirectionsCar sx={{ mr: 1, fontSize: '1.2rem', color: 'rgba(255, 255, 255, 0.7)' }} />
                    Getting There
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                    {event.venue?.directions || 'Directions not available'}
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </motion.div>
  );
};

export default EventDetails; 