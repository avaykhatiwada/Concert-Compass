import React, { useState, useEffect } from 'react'; // Importing React and its hooks
import { useParams, useNavigate } from 'react-router-dom'; // Importing hooks for routing
import {
  Container,
  Box,
  Typography,
  Card,
  CardMedia,
  Grid,
  IconButton,
  Chip,
  styled,
  Link,
  Button,
  Divider,
  CircularProgress,
  useTheme,
  Alert,
} from '@mui/material'; // Importing Material-UI components
import {
  Instagram,
  Facebook,
  YouTube,
  Twitter,
  CalendarToday,
  LocationOn,
  AccessTime,
  ArrowBack,
  MusicNote,
  Star,
  AttachMoney,
} from '@mui/icons-material'; // Importing Material-UI icons
import { motion, AnimatePresence } from 'framer-motion'; // Importing Framer Motion for animations
import dayjs from 'dayjs'; // Importing dayjs for date formatting

// Styled component for a glass-like card effect
const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  border: '1px solid rgba(255, 255, 255, 0.1)',
  overflow: 'visible',
  position: 'relative',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)',
    transform: 'translateY(-5px)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 'inherit',
    background: 'linear-gradient(45deg, rgba(33, 150, 243, 0.1), rgba(33, 203, 243, 0.1))',
    zIndex: -1,
  },
}));

// Styled component for social media buttons
const SocialButton = styled(IconButton)(({ theme }) => ({
  color: 'white',
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(5px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'all 0.3s ease',
  width: 40,
  height: 40,
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateY(-3px) scale(1.1)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  },
}));

// Styled component for performance cards
const PerformanceCard = styled(motion.div)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(5px)',
  borderRadius: theme.spacing(2),
  border: '1px solid rgba(255, 255, 255, 0.1)',
  padding: theme.spacing(3),
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.05)',
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.25)',
  },
}));

// Styled component for chips
const StyledChip = styled(Chip)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(5px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: theme.palette.primary.main,
  fontWeight: 500,
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateY(-2px)',
  },
}));

// Styled component for section titles
const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

// Styled component for achievement chips
const AchievementChip = styled(StyledChip)(({ theme }) => ({
  backgroundColor: 'rgba(255, 193, 7, 0.1)',
  borderColor: 'rgba(255, 193, 7, 0.2)',
  color: theme.palette.warning.light,
  '& .MuiChip-icon': {
    color: theme.palette.warning.light,
  },
}));

// Styled component for song chips
const SongChip = styled(StyledChip)(({ theme }) => ({
  backgroundColor: 'rgba(33, 150, 243, 0.1)',
  borderColor: 'rgba(33, 150, 243, 0.2)',
  color: theme.palette.primary.light,
  '& .MuiChip-icon': {
    color: theme.palette.primary.light,
  },
}));

// Main component for displaying artist details
const ArtistDetails = () => {
  const { id } = useParams(); // Extracting the artist ID from the URL
  const navigate = useNavigate(); // Hook for navigation
  const theme = useTheme(); // Hook for accessing the theme
  const [artist, setArtist] = useState(null); // State for storing artist data
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling

  // Effect hook to fetch artist details when the component mounts or the ID changes
  useEffect(() => {
    const fetchArtistDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Log the received ID for debugging
        console.log('Attempting to fetch artist with ID:', id);

        // Validate ID format
        if (!id) {
          console.error('No artist ID provided');
          setError('Artist ID is required');
          setLoading(false);
          return;
        }

        // Allow both MongoDB ObjectId format and other ID formats
        if (!/^[0-9a-fA-F]{24}$/.test(id) && !/^\d+$/.test(id)) {
          console.error('Invalid artist ID format:', id);
          setError('Invalid artist ID format');
          setLoading(false);
          return;
        }

        // Fetch artist details from the API
        const response = await fetch(`/api/artists/${id}`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        // Handle response errors
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Error response from server:', {
            status: response.status,
            statusText: response.statusText,
            error: errorData
          });

          if (response.status === 404) {
            setError('Artist not found. Please check the URL and try again.');
          } else {
            setError(errorData.message || 'Failed to fetch artist details. Please try again later.');
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        
        // Check if we received an event object instead of an artist object
        if (data && data.artists && Array.isArray(data.artists)) {
          console.log('Received event object instead of artist object, extracting artist data');
          // Find the artist with the matching ID in the event's artists array
          const artistFromEvent = data.artists.find(artist => 
            (artist._id === id || artist.id === id)
          );
          
          if (artistFromEvent) {
            console.log('Found matching artist in event:', artistFromEvent.name);
            // Use the artist data from the event
            processArtistData(artistFromEvent);
            return;
          } else {
            console.error('Artist not found in event data');
            setError('Artist not found in event data');
            setLoading(false);
            return;
          }
        }
        
        // Process regular artist data
        processArtistData(data);
      } catch (err) {
        console.error('Error in fetchArtistDetails:', err);
        setError('An unexpected error occurred. Please try again later.');
        setLoading(false);
      }
    };
    
    // Helper function to process and validate artist data
    const processArtistData = (data) => {
      // Validate and structure the received data
      if (!data || !data.name) {
        console.error('Invalid artist data received:', data);
        setError('Invalid artist data received from server');
        setLoading(false);
        return;
      }

      // Ensure proper data structure with defaults
      const formattedData = {
        ...data,
        social: {
          instagram: data.social?.instagram || '',
          facebook: data.social?.facebook || '',
          youtube: data.social?.youtube || '',
          twitter: data.social?.twitter || '',
          ...data.social
        },
        achievements: data.achievements || [],
        popularSongs: data.popularSongs || [],
        upcomingPerformances: data.upcomingPerformances || []
      };

      console.log('Successfully processed artist data:', {
        id: formattedData._id,
        name: formattedData.name,
        genre: formattedData.genre,
        upcomingPerformances: formattedData.upcomingPerformances?.length
      });

      setArtist(formattedData);
      setLoading(false);
    };

    fetchArtistDetails();
  }, [id]);

  // Display loading spinner while fetching data
  if (loading) {
    return (
      <Container sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={40} />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading artist details...
          </Typography>
        </Box>
      </Container>
    );
  }

  // Display error message if there's an error
  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
          <Button 
            variant="contained" 
            onClick={() => navigate(-1)}
            startIcon={<ArrowBack />}
            sx={{ mt: 2 }}
          >
            Back to Events
          </Button>
        </Box>
      </Container>
    );
  }

  // Display message if artist is not found
  if (!artist) {
    return (
      <Container sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" gutterBottom>
            Artist not found
          </Typography>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{
              mt: 2,
              color: 'white',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(5px)',
              borderRadius: theme.spacing(2),
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Back to Events
          </Button>
        </Box>
      </Container>
    );
  }

  // Main return statement for the component
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{
            mb: 4,
            color: 'white',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(5px)',
            borderRadius: theme.spacing(2),
            padding: '8px 16px',
            fontWeight: 500,
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.1)',
              transform: 'translateX(-5px)',
            },
          }}
        >
          Back to Events
        </Button>

        <Grid container spacing={4}>
          {/* Artist Info */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="400"
                    image={artist.image || `https://source.unsplash.com/random/400x400/?artist,${artist._id || ''}`}
                    alt={artist.name || 'Artist'}
                    sx={{
                      objectFit: 'cover',
                      borderRadius: `${theme.spacing(2)} ${theme.spacing(2)} 0 0`,
                      filter: 'brightness(0.9)',
                    }}
                    onError={(e) => {
                      e.target.src = `https://source.unsplash.com/random/400x400/?artist,${artist._id || ''}`;
                    }}
                  />
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      left: 0, 
                      right: 0, 
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                      padding: 2,
                      paddingTop: 4,
                    }}
                  >
                    <Typography
                      variant="h4"
                      gutterBottom
                      sx={{
                        fontWeight: 700,
                        color: 'white',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                      }}
                    >
                      {artist.name || 'Unknown Artist'}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                      }}
                    >
                      <MusicNote sx={{ fontSize: 20 }} />
                      {artist.genre || 'Various Genres'}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary', lineHeight: 1.8, fontSize: '1.05rem' }}>
                    {artist.bio || artist.description || 'No biography available for this artist.'}
                  </Typography>
                  
                  <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                  
                  {artist.achievements && artist.achievements.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <SectionTitle variant="h6" gutterBottom>
                        <Star sx={{ color: theme.palette.warning.main }} />
                        Achievements
                      </SectionTitle>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                        {artist.achievements.map((achievement, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: 0.1 + index * 0.05 }}
                          >
                            <AchievementChip
                              icon={<Star fontSize="small" />}
                              label={typeof achievement === 'string' ? achievement : 'Achievement'}
                              sx={{ width: 'fit-content' }}
                            />
                          </motion.div>
                        ))}
                      </Box>
                    </motion.div>
                  )}
                  
                  {artist.popularSongs && artist.popularSongs.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <SectionTitle variant="h6" gutterBottom>
                        <MusicNote sx={{ color: theme.palette.primary.main }} />
                        Popular Songs
                      </SectionTitle>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                        {artist.popularSongs.map((song, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2, delay: 0.2 + index * 0.05 }}
                          >
                            <SongChip
                              icon={<MusicNote fontSize="small" />}
                              label={typeof song === 'string' ? song : 'Song'}
                            />
                          </motion.div>
                        ))}
                      </Box>
                    </motion.div>
                  )}
                  
                  {(artist.social?.instagram || artist.social?.facebook || artist.social?.youtube || artist.social?.twitter) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <SectionTitle variant="h6" gutterBottom>
                        Follow on Social Media
                      </SectionTitle>
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                        {artist.social?.instagram && (
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <SocialButton
                              component={Link}
                              href={`https://instagram.com/${artist.social.instagram}`}
                              target="_blank"
                              aria-label="Instagram"
                              sx={{ 
                                '&:hover': { 
                                  backgroundColor: '#E1306C',
                                  borderColor: '#E1306C' 
                                } 
                              }}
                            >
                              <Instagram />
                            </SocialButton>
                          </motion.div>
                        )}
                        {artist.social?.facebook && (
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <SocialButton
                              component={Link}
                              href={`https://facebook.com/${artist.social.facebook}`}
                              target="_blank"
                              aria-label="Facebook"
                              sx={{ 
                                '&:hover': { 
                                  backgroundColor: '#4267B2',
                                  borderColor: '#4267B2' 
                                } 
                              }}
                            >
                              <Facebook />
                            </SocialButton>
                          </motion.div>
                        )}
                        {artist.social?.youtube && (
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <SocialButton
                              component={Link}
                              href={`https://youtube.com/${artist.social.youtube}`}
                              target="_blank"
                              aria-label="YouTube"
                              sx={{ 
                                '&:hover': { 
                                  backgroundColor: '#FF0000',
                                  borderColor: '#FF0000' 
                                } 
                              }}
                            >
                              <YouTube />
                            </SocialButton>
                          </motion.div>
                        )}
                        {artist.social?.twitter && (
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <SocialButton
                              component={Link}
                              href={`https://twitter.com/${artist.social.twitter}`}
                              target="_blank"
                              aria-label="Twitter"
                              sx={{ 
                                '&:hover': { 
                                  backgroundColor: '#1DA1F2',
                                  borderColor: '#1DA1F2' 
                                } 
                              }}
                            >
                              <Twitter />
                            </SocialButton>
                          </motion.div>
                        )}
                      </Box>
                    </motion.div>
                  )}
                </Box>
              </GlassCard>
            </motion.div>
          </Grid>

          {/* Upcoming Performances */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <SectionTitle
                variant="h5"
                gutterBottom
                sx={{
                  mb: 3,
                  fontSize: '1.75rem',
                }}
              >
                <CalendarToday sx={{ fontSize: 24 }} />
                Upcoming Performances
              </SectionTitle>
              
              <Grid container spacing={3}>
                {artist.upcomingPerformances && artist.upcomingPerformances.length > 0 ? (
                  artist.upcomingPerformances.map((performance, index) => (
                    <Grid item xs={12} key={index}>
                      <PerformanceCard
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                          <Box sx={{ flex: 1, minWidth: '250px' }}>
                            <Typography variant="h6" gutterBottom sx={{ 
                              color: 'white', 
                              fontWeight: 600,
                              fontSize: '1.25rem',
                              background: 'linear-gradient(45deg, #fff 30%, #e0e0e0 90%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}>
                              {typeof performance.event === 'string' ? performance.event : 'Event'}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                              <StyledChip
                                icon={<CalendarToday sx={{ fontSize: 16 }} />}
                                label={performance.date ? dayjs(performance.date).format('MMM D, YYYY') : 'Date TBA'}
                                sx={{ backgroundColor: 'rgba(33, 150, 243, 0.1)' }}
                              />
                              <StyledChip
                                icon={<AccessTime sx={{ fontSize: 16 }} />}
                                label={performance.time || 'Time TBA'}
                                sx={{ backgroundColor: 'rgba(0, 200, 83, 0.1)' }}
                              />
                              <StyledChip
                                icon={<LocationOn sx={{ fontSize: 16 }} />}
                                label={typeof performance.venue === 'string' ? performance.venue : 'Venue TBA'}
                                sx={{ backgroundColor: 'rgba(233, 30, 99, 0.1)' }}
                              />
                            </Box>
                            <Typography variant="body2" sx={{ 
                              color: 'text.secondary',
                              fontSize: '1rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}>
                              <AttachMoney sx={{ fontSize: 18 }} />
                              Ticket Price: ₨ {performance.ticketPrice ? performance.ticketPrice.toLocaleString() : 'TBA'}
                            </Typography>
                          </Box>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="contained"
                              onClick={() => navigate('/customer/events')}
                              sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                                boxShadow: '0 4px 15px 0 rgba(33, 150, 243, 0.3)',
                                padding: '10px 24px',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                '&:hover': {
                                  background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                                  boxShadow: '0 6px 20px 0 rgba(33, 150, 243, 0.4)',
                                },
                              }}
                            >
                              Book Tickets
                            </Button>
                          </motion.div>
                        </Box>
                      </PerformanceCard>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Box sx={{ 
                      p: 4, 
                      textAlign: 'center', 
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: theme.spacing(2),
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    }}>
                      <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.1rem' }}>
                        No upcoming performances scheduled.
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: 1 }}>
                        Check back later for updates on future events.
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default ArtistDetails; // Exporting the ArtistDetails component