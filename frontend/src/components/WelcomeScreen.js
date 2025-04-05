import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  useTheme,
  Paper,
  Avatar,
  Card,
  CardContent,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Person,
  BusinessCenter,
  Close,
  MusicNote,
  Event,
  LocationOn,
  Security,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Simplified hero section with cleaner background
const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #1a237e 0%, #121212 100%)',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, rgba(33, 150, 243, 0.1), transparent 70%)',
  },
}));

// More professional card design
const ContentCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  border: '1px solid rgba(255, 255, 255, 0.1)',
  maxWidth: '1200px',
  margin: '0 auto',
  position: 'relative',
  zIndex: 1,
  overflow: 'hidden',
}));

// Simplified feature card
const FeatureCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(5px)',
  borderRadius: theme.spacing(2),
  height: '100%',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.05)',
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  },
}));

// Role selection button
const RoleButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(5px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(33, 150, 243, 0.2)',
    border: '1px solid rgba(33, 150, 243, 0.3)',
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 30px rgba(33, 150, 243, 0.2)',
  },
}));

// Stats section
const StatsSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  flexWrap: 'wrap',
  gap: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const StatItem = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  color: 'rgba(255, 255, 255, 0.9)',
}));

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [roleDialog, setRoleDialog] = useState(false);

  const handleEventClick = () => {
    setRoleDialog(true);
  };

  const handleRoleSelect = (role) => {
    setRoleDialog(false);
    if (role === 'organizer') {
      navigate('/admin/sign-in');
    } else {
      navigate('/customer/auth');
    }
  };

  // Simplified features list
  const features = [
    {
      icon: <MusicNote sx={{ fontSize: 40, color: '#2196f3' }} />,
      title: 'Live Music',
      description: 'Experience the best live performances from top artists',
    },
    {
      icon: <Event sx={{ fontSize: 40, color: '#f50057' }} />,
      title: 'Easy Booking',
      description: 'Secure your tickets in minutes with our seamless booking system',
    },
    {
      icon: <LocationOn sx={{ fontSize: 40, color: '#4caf50' }} />,
      title: 'Venue Selection',
      description: 'Choose from the best venues across major cities',
    },
    {
      icon: <Security sx={{ fontSize: 40, color: '#9c27b0' }} />,
      title: 'Secure Payments',
      description: 'Safe and secure payment processing for all transactions',
    },
  ];

  return (
    <HeroSection>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ContentCard elevation={0}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                textAlign: 'center',
                mb: 2,
                color: '#fff',
              }}
            >
              ConcertCompass
            </Typography>

            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                mb: 4,
                color: 'rgba(255, 255, 255, 0.8)',
                maxWidth: '800px',
                mx: 'auto',
              }}
            >
              Your ultimate destination for discovering and booking the best concerts
            </Typography>

            <StatsSection>
              <StatItem>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#2196f3' }}>50+</Typography>
                <Typography variant="subtitle1">Events Monthly</Typography>
              </StatItem>
              <StatItem>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#f50057' }}>10K+</Typography>
                <Typography variant="subtitle1">Happy Customers</Typography>
              </StatItem>
              <StatItem>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#ffb300' }}>100+</Typography>
                <Typography variant="subtitle1">Partner Venues</Typography>
              </StatItem>
            </StatsSection>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <FeatureCard>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Avatar
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          width: 60,
                          height: 60,
                          mx: 'auto',
                          mb: 2,
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                      <Typography variant="h6" sx={{ mb: 1, color: 'white' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </FeatureCard>
                </Grid>
              ))}
            </Grid>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 2,
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={handleEventClick}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(45deg, #2196f3, #64b5f6)',
                  textTransform: 'none',
                }}
              >
                Get Started
              </Button>
            </Box>
          </ContentCard>
        </motion.div>
      </Container>

      <Dialog
        open={roleDialog}
        onClose={() => setRoleDialog(false)}
        PaperProps={{
          style: {
            background: 'rgba(18, 18, 18, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'white' }}>
            Choose Your Role
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => setRoleDialog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <RoleButton
                fullWidth
                onClick={() => handleRoleSelect('customer')}
                sx={{ height: '100%' }}
              >
                <Person sx={{ fontSize: 36, color: '#2196f3', mb: 1 }} />
                <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                  Customer
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Browse and book concert tickets
                </Typography>
              </RoleButton>
            </Grid>
            <Grid item xs={12} sm={6}>
              <RoleButton
                fullWidth
                onClick={() => handleRoleSelect('organizer')}
                sx={{ height: '100%' }}
              >
                <BusinessCenter sx={{ fontSize: 36, color: '#f50057', mb: 1 }} />
                <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                  Organizer
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Manage events and bookings
                </Typography>
              </RoleButton>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </HeroSection>
  );
};

export default WelcomeScreen; 