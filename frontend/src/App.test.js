import { render, screen } from '@testing-library/react';
import App from './App';

// Set test environment variable first
beforeAll(() => {
  process.env.REACT_APP_CLERK_PUBLISHABLE_KEY = 'REACT_APP_CLERK_PUBLISHABLE_KEY=sk_test_RGGoUZhd3naOHdPBUNDjN51f1Yr4g0hkedf3yYM1eG';
});

// Minimal Clerk mock
jest.mock('@clerk/clerk-react', () => ({
  ClerkProvider: ({ children }) => <div>{children}</div>,
  useUser: () => ({
    isSignedIn: false,
    user: null,
  }),
  useAuth: () => ({
    getToken: jest.fn()
  })
}));

test('renders app container', () => {
  render(<App />);
  
  // Very basic test - just check if app renders
  const appElement = screen.getByTestId('app-container'); // Add this to your App component
  expect(appElement).toBeInTheDocument();
});