// Core React and Router imports
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, createRoutesFromElements, useLocation } from 'react-router-dom';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  useAuth,
  useUser,
  useSession,
} from '@clerk/clerk-react';

// Material UI imports
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, CircularProgress } from '@mui/material';

// Component imports
import Navbar from './components/Navbar';
import WelcomeScreen from './components/WelcomeScreen';
import CustomerAuthPage from './components/Auth/CustomerAuthPage';
import OrganizerDashboard from './components/Organizer/OrganizerDashboard';
import EventList from './components/EventList';
import ArtistDetails from './components/Artist/ArtistDetails';
import WalletDashboard from './components/Customer/WalletDashboard';
import BookingHistory from './components/Customer/BookingHistory';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminAuth from './components/Admin/AdminAuth';

// Create a dark theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#121212',
      paper: 'rgba(18, 18, 18, 0.95)',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    navigate('/customer/auth');
    return null;
  }

  return children;
};

// Admin/Organizer Route Component
const AdminRoute = ({ children, requiredRole }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // TODO: Replace with actual API call to get user role
    setUserRole('admin'); // Mock user role
  }, []);

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    navigate('/admin/auth');
    return null;
  }

  if (userRole !== requiredRole) {
    navigate('/');
    return null;
  }

  return children;
};

// Protected Admin Route Component
const ProtectedAdminRoute = ({ children }) => {
  const { user, isLoaded } = useUser();
  const { session } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAdminStatus = async () => {
      // If not loaded yet, keep waiting
      if (!isLoaded) {
        return;
      }

      // If no user, redirect to sign in
      if (!user || !session) {
        setLoading(false);
        // Store the attempted URL to redirect back after login
        navigate('/admin/sign-in', { 
          replace: true,
          state: { from: location.pathname }
        });
        return;
      }

      try {
        const userEmail = user?.primaryEmailAddress?.emailAddress;
        if (!userEmail) {
          console.error('No email address found for user');
          setLoading(false);
          setIsAdmin(false);
          return;
        }

        const token = await session.getToken();
        if (!token) {
          console.error('Failed to get token from session');
          setLoading(false);
          setIsAdmin(false);
          return;
        }

        console.log('Making admin check request:', {
          userEmail,
          hasToken: !!token
        });

        const response = await fetch('/api/auth/check-admin', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-User-Email': userEmail
          },
          credentials: 'include'
        });
        
        const data = await response.json();
        console.log('Admin check response:', data);
        
        setIsAdmin(data.isAdmin);
        setLoading(false);

        // Only redirect if not admin and not already on the sign-in page
        if (!data.isAdmin && !location.pathname.includes('/admin/sign-in')) {
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [isLoaded, user, session, navigate, location.pathname]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return isAdmin ? children : null;
};

// Check for Clerk publishable key
if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk publishable key');
}

function App() {
  return (
    <ClerkProvider
      publishableKey={process.env.REACT_APP_CLERK_PUBLISHABLE_KEY}
      navigate={(to) => window.location.href = to}
    >
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CssBaseline />
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Navbar />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<WelcomeScreen />} />
              <Route path="/customer/auth" element={<CustomerAuthPage />} />
              
              {/* Protected Customer Routes */}
              <Route
                path="/customer/events"
                element={
                  <ProtectedRoute>
                    <EventList />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/customer/artists/:id"
                element={
                  <ProtectedRoute>
                    <ArtistDetails />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/customer/wallet"
                element={
                  <ProtectedRoute>
                    <WalletDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/customer/bookings"
                element={
                  <ProtectedRoute>
                    <BookingHistory />
                  </ProtectedRoute>
                }
              />
              
              {/* Admin Routes - renamed to Organizer Routes but keeping the same paths for compatibility */}
              <Route path="/admin/sign-in" element={<AdminAuth />} />
              <Route
                path="/admin/*"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />

              {/* Organizer Routes */}
              <Route
                path="/organizer/*"
                element={
                  <SignedIn>
                    <OrganizerDashboard />
                  </SignedIn>
                }
              />
              
              {/* Redirect unknown routes to welcome page */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}

export default App;
