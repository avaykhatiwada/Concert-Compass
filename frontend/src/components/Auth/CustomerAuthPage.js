import React, { useState, useEffect } from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  styled,
  useTheme,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(20px)',
  borderRadius: theme.spacing(4),
  border: '1px solid rgba(255, 255, 255, 0.1)',
  padding: theme.spacing(4),
  maxWidth: 500,
  width: '100%',
  position: 'relative',
  overflow: 'visible',
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

const StyledTab = styled(Tab)(({ theme }) => ({
  minWidth: 120,
  fontSize: '1rem',
  fontWeight: 500,
  textTransform: 'none',
  borderRadius: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&.Mui-selected': {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
  },
}));

const TabPanel = ({ children, value, index }) => (
  <AnimatePresence mode="wait">
    {value === index && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        style={{ width: '100%' }}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

const CustomerAuthPage = () => {
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const tab = parseInt(searchParams.get('tab') || '0');
    setActiveTab(tab);
  }, [searchParams]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSearchParams({ tab: newValue });
  };

  const commonAppearance = {
    elements: {
      formButtonPrimary: {
        fontSize: '1rem',
        fontWeight: 500,
        padding: '12px',
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
        },
      },
      card: {
        backgroundColor: 'transparent',
        border: 'none',
        boxShadow: 'none',
      },
      headerTitle: {
        fontSize: '1.5rem',
        fontWeight: 600,
        color: 'white',
      },
      headerSubtitle: {
        fontSize: '1rem',
        color: 'rgba(255, 255, 255, 0.7)',
      },
      formFieldLabel: {
        fontSize: '0.9rem',
        fontWeight: 500,
        color: 'rgba(255, 255, 255, 0.9)',
      },
      formFieldInput: {
        fontSize: '1rem',
        padding: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '8px',
        color: 'white',
        '&:focus': {
          borderColor: theme.palette.primary.main,
          backgroundColor: 'rgba(255, 255, 255, 0.07)',
          boxShadow: `0 0 0 2px ${theme.palette.primary.main}25`,
        },
      },
      footerActionLink: {
        color: theme.palette.primary.main,
        fontWeight: 500,
        '&:hover': {
          color: theme.palette.primary.light,
        },
      },
      dividerLine: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      },
      dividerText: {
        color: 'rgba(255, 255, 255, 0.5)',
      },
      socialButtonsBlockButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
      },
      socialButtonsBlockButtonText: {
        color: 'white',
        fontWeight: 500,
      },
      formFieldAction: {
        color: theme.palette.primary.main,
      },
      alert: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
      },
    },
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        background: 'radial-gradient(circle at top right, rgba(33, 150, 243, 0.1), transparent 40%)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard elevation={0}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              {activeTab === 0 ? 'Sign in to continue your journey' : 'Create an account to get started'}
            </Typography>
          </Box>

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered
            sx={{
              mb: 4,
              '& .MuiTabs-indicator': {
                display: 'none',
              },
            }}
          >
            <StyledTab label="Sign In" />
            <StyledTab label="Sign Up" />
          </Tabs>

          <Box>
            <TabPanel value={activeTab} index={0}>
              <SignIn
                afterSignInUrl="/customer/events"
                signUpUrl="/customer/auth?tab=1"
                appearance={commonAppearance}
              />
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <SignUp
                afterSignUpUrl="/customer/events"
                signInUrl="/customer/auth?tab=0"
                appearance={commonAppearance}
              />
            </TabPanel>
          </Box>
        </GlassCard>
      </motion.div>
    </Container>
  );
};

export default CustomerAuthPage; 