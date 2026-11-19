import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Allow guest / offline tokens without requiring database auth
  if (!token || token.includes('guest') || token.includes('offline') || token.includes('local')) {
    req.user = { userId: 'guest', email: 'guest@budgetbuddy.app' };
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) {
      // Gracefully fall back to guest session
      req.user = { userId: 'guest', email: 'guest@budgetbuddy.app' };
      return next();
    }
    req.user = user;
    next();
  });
};
