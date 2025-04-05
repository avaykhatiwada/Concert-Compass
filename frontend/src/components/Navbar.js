import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Event as EventIcon,
  Dashboard as DashboardIcon,
  AccountBalanceWallet as WalletIcon,
  AdminPanelSettings as AdminIcon,
  ConfirmationNumber as TicketIcon,
} from '@mui/icons-material';
import { useAuth, useUser, useSession } from '@clerk/clerk-react';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const { session } = useSession();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isSignedIn || !session || !user) {
        console.log('Auth state check:', { 
          isSignedIn, 
          hasSession: !!session,
          hasUser: !!user,
          userEmail: user?.primaryEmailAddress?.emailAddress
        });
        setIsAdmin(false);
        return;
      }

      try {
        const userEmail = user?.primaryEmailAddress?.emailAddress;
        if (!userEmail) {
          console.error('No email address found for user');
          setIsAdmin(false);
          return;
        }

        console.log('Starting admin check...', {
          userEmail,
          userId: user?.id,
          sessionId: session?.id
        });

        // Get a fresh token without template specification
        const token = await session.getToken();
        
        if (!token) {
          console.error('Failed to get token from session');
          setIsAdmin(false);
          return;
        }

        console.log('Token obtained:', { 
          hasToken: true,
          tokenLength: token.length,
          userEmail
        });

        // Create headers with consistent email
        const headers = new Headers({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-User-Email': userEmail
        });
        
        const response = await fetch('/api/auth/check-admin', {
          method: 'GET',
          headers,
          credentials: 'include'
        });
        
        console.log('Response received:', {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText
        });

        if (!response.ok) {
          let errorData = {};
          try {
            errorData = await response.json();
          } catch (e) {
            console.error('Failed to parse error response:', e);
          }
          
          console.error('Admin check failed:', {
            status: response.status,
            statusText: response.statusText,
            error: errorData,
            userEmail
          });
          setIsAdmin(false);
          return;
        }

        const data = await response.json();
        console.log('Admin check result:', {
          ...data,
          userEmail
        });
        setIsAdmin(data.isAdmin);
      } catch (error) {
        console.error('Admin check error:', {
          message: error.message,
          stack: error.stack,
          userEmail: user?.primaryEmailAddress?.emailAddress
        });
        setIsAdmin(false);
      }
    };

    // Run the check when signed in
    if (isSignedIn) {
      checkAdminStatus();
    } else {
      setIsAdmin(false);
    }
  }, [isSignedIn, session, user]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenu = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchorEl(null);
  };

  const handleSignOut = () => {
    handleClose();
    signOut();
  };

  const menuItems = [
    { text: 'Events', path: '/events', icon: <EventIcon /> },
    ...(isAdmin ? [{ text: 'Admin Dashboard', path: '/admin', icon: <AdminIcon /> }] : []),
    { text: 'My Bookings', path: '/customer/bookings', icon: <TicketIcon /> },
    { text: 'Wallet', path: '/customer/wallet', icon: <WalletIcon /> },
  ];

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMenuAnchorEl}
      open={Boolean(mobileMenuAnchorEl)}
      onClose={handleClose}
    >
      {menuItems.map((item) => (
        <MenuItem
          key={item.path}
          component={RouterLink}
          to={item.path}
          onClick={handleClose}
          selected={location.pathname === item.path}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <Typography variant="inherit">{item.text}</Typography>
        </MenuItem>
      ))}
      {isSignedIn && (
        <>
          <Divider />
          <MenuItem onClick={handleSignOut}>
            <ListItemIcon><AccountCircle /></ListItemIcon>
            <Typography variant="inherit">Sign Out</Typography>
          </MenuItem>
        </>
      )}
    </Menu>
  );

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 700,
          }}
        >
          ConcertCompass
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenu}
            >
              <MenuIcon />
            </IconButton>
            {renderMobileMenu}
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {menuItems.map((item) => (
              <Button
                key={item.path}
                component={RouterLink}
                to={item.path}
                color="inherit"
                startIcon={item.icon}
                sx={{
                  '&.Mui-selected': {
                    color: 'primary.main',
                  },
                }}
                selected={location.pathname === item.path}
              >
                {item.text}
        </Button>
            ))}
            
            {isSignedIn ? (
              <>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={RouterLink}
                to="/sign-in"
                color="inherit"
              >
                Sign In
        </Button>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 