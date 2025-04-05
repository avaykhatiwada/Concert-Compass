const jwt = require('jsonwebtoken');

const verifyToken = async (token, userEmail) => {
  try {
    const decoded = jwt.verify(token, process.env.CLERK_JWT_PUBLIC_KEY, {
      algorithms: ['RS256'],
      complete: true
    });

    if (!decoded) {
      console.log('Token verification failed: No decoded data');
      return null;
    }

    // Log the full decoded token for debugging
    console.log('Full decoded token:', JSON.stringify(decoded, null, 2));

    // Get the payload and attach the email from headers
    const payload = decoded.payload;
    payload.email = userEmail;

    console.log('Token verification successful:', {
      sub: payload.sub,
      email: payload.email,
      hasEmail: !!payload.email
    });

    return payload;
  } catch (error) {
    console.error('Token verification error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return null;
  }
};

module.exports = {
  verifyToken
}; 