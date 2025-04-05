import React, { useState } from 'react'; 
// Import React and the useState hook from React to manage component state.
import { useNavigate, useLocation } from 'react-router-dom'; 
// Import useNavigate and useLocation hooks from react-router-dom for handling navigation and retrieving location state.
import { 
  Container, 
  Box, 
  Typography, 
  Alert, 
  styled, 
  CircularProgress 
} from '@mui/material'; 
// Import components from Material UI (Container, Box, Typography, Alert, CircularProgress) for layout and UI elements.
import { SignIn, useUser, useSession } from '@clerk/clerk-react'; 
// Import Clerk authentication components and hooks for user management (useUser, useSession) and SignIn component for handling sign-in UI.

const GlassContainer = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)', 
  // Set background with slight transparency for frosted glass effect.
  backdropFilter: 'blur(10px)', 
  // Apply a blur filter to create a frosted glass effect.
  borderRadius: theme.spacing(2), 
  // Set rounded corners using theme spacing for consistency with the app design.
  border: '1px solid rgba(255, 255, 255, 0.1)', 
  // Add a soft border around the container with transparency.
  padding: theme.spacing(4), 
  // Set padding using theme spacing for proper spacing inside the container.
  maxWidth: 500, 
  // Set a maximum width for the container to prevent it from stretching too wide.
  width: '100%', 
  // Set width to 100% of the available space, but max out at 500px.
  margin: '0 auto', 
  // Center the container horizontally in its parent.
}));

const AdminAuth = () => { 
  // Define the AdminAuth component that handles admin authentication.
  const { user, isLoaded } = useUser(); 
  // Retrieve user data and loading state from Clerk's useUser hook.
  const { session } = useSession(); 
  // Retrieve session data from Clerk's useSession hook.
  const navigate = useNavigate(); 
  // Initialize the navigation function from React Router to navigate programmatically.
  const location = useLocation(); 
  // Get the current location object from React Router, which contains the state of the current route.
  const [checking, setChecking] = useState(true); 
  // Declare state to manage loading/checking state (whether the admin check is in progress).
  const [error, setError] = useState(null); 
  // Declare state to store error messages if something goes wrong during authentication.

  React.useEffect(() => { 
    // useEffect hook to run the authentication check when the component mounts or dependencies change.
    const checkAdminAndRedirect = async () => { 
      // Define an async function to check if the user is an admin and handle redirection.
      if (!isLoaded) { 
        // If Clerk data is not loaded yet, do nothing and return early.
        return; 
      }

      if (!user) { 
        // If no user is logged in, stop checking and allow sign-in.
        setChecking(false); 
        return; 
      }

      try {
        const userEmail = user?.primaryEmailAddress?.emailAddress; 
        // Extract the email address from the user object (Clerk provides the user details).
        if (!userEmail) { 
          // If there’s no email address, set an error and stop checking.
          setError('No email address found for your account'); 
          setChecking(false); 
          return; 
        }

        console.log('Starting admin check...', { 
          userEmail, 
          userId: user?.id, 
          sessionId: session?.id 
        }); 
        // Log user details for debugging purposes.

        const token = await session.getToken(); 
        // Fetch a fresh authentication token from the session.

        if (!token) { 
          // If no token is returned, set an error message and stop checking.
          setError('Unable to authenticate your session'); 
          setChecking(false); 
          return; 
        }

        console.log('Token obtained:', { 
          hasToken: true, 
          tokenLength: token.length, 
          userEmail 
        }); 
        // Log token-related information for debugging purposes.

        const response = await fetch('/api/auth/check-admin', { 
          // Send a request to the backend to check if the user is an admin.
          headers: { 
            'Authorization': `Bearer ${token}`, 
            // Send the token as a bearer token for authorization.
            'Content-Type': 'application/json', 
            // Indicate that the content is JSON.
            'X-User-Email': userEmail 
            // Include the user's email in the request header for identification.
          },
          credentials: 'include' 
          // Include credentials (cookies) in the request for session persistence.
        });

        const data = await response.json(); 
        // Parse the JSON response from the backend.

        if (response.ok && data.isAdmin) { 
          // If the response is successful and the user is an admin, redirect.
          const from = location.state?.from || '/admin'; 
          // Retrieve the original attempted URL or default to '/admin'.
          navigate(from, { replace: true }); 
          // Redirect the user to the admin dashboard or their originally intended location.
        } else { 
          // If the user is not an admin, set an error and stop checking.
          setError('You do not have administrator privileges'); 
          setChecking(false); 
        }
      } catch (error) { 
        // If any error occurs during the process, log the error and set an error message.
        console.error('Error checking admin status:', error); 
        setError('An error occurred while checking your admin status'); 
        setChecking(false); 
      }
    };

    checkAdminAndRedirect(); 
    // Call the function to perform the admin check.
  }, [isLoaded, user, navigate, location.state]); 
  // The effect runs when `isLoaded`, `user`, `navigate`, or `location.state` changes.

  if (checking) { 
    // If still checking (loading), render the loading spinner.
    return ( 
      <Container 
        maxWidth={false} 
        sx={{
          minHeight: 'calc(100vh - 64px)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
        }}
      >
        <CircularProgress /> 
        {/* Display a circular progress spinner while loading */}
      </Container>
    );
  }

  return ( 
    <Container 
      maxWidth={false} 
      sx={{
        minHeight: 'calc(100vh - 64px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        py: 4, 
        background: 'radial-gradient(circle at top right, rgba(33, 150, 243, 0.1), transparent 40%)',
      }}
    >
      <GlassContainer> 
        {/* Render the styled "GlassContainer" with frosted glass effect */}
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{
            textAlign: 'center', 
            fontWeight: 700, 
            background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent', 
            mb: 4,
          }}
        >
          Organizer Login 
          {/* Display the title for the login section with a gradient text effect */}
        </Typography>

        {error && ( 
          // If there's an error, display an Alert with the error message.
          <Alert severity="error" sx={{ mb: 3 }}>
            {error} 
          </Alert>
        )}

        <SignIn 
          appearance={{ 
            elements: { 
              formButtonPrimary: { 
                backgroundColor: '#1976d2', 
                '&:hover': { 
                  backgroundColor: '#1565c0', 
                },
              },
              card: { 
                backgroundColor: 'transparent', 
                border: 'none', 
              },
              headerTitle: { 
                color: 'white', 
              },
              headerSubtitle: { 
                color: 'rgba(255, 255, 255, 0.7)', 
              },
              formFieldLabel: { 
                color: 'rgba(255, 255, 255, 0.7)', 
              },
              formFieldInput: { 
                backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                borderColor: 'rgba(255, 255, 255, 0.1)', 
                color: 'white', 
                '&:focus': { 
                  borderColor: '#1976d2', 
                  backgroundColor: 'rgba(255, 255, 255, 0.07)', 
                },
              },
              footerActionLink: { 
                color: '#1976d2', 
              },
            },
          }} 
          afterSignInUrl="/admin" 
          signUpUrl={null} 
        />
        {/* Render the Clerk SignIn component with custom styles and redirect to `/admin` after successful sign-in */}
      </GlassContainer>
    </Container>
  );
};

export default AdminAuth; 
// Export the AdminAuth component to be used in other parts of the app.
