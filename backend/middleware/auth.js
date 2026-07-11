const jwt = require('jsonwebtoken'); // require is use to import the jsonwebtoken library for handling JWTs

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; 
  if (!token) return res.status(401).json({ message: 'No token, access denied' });

  try {
    const secret = process.env.JWT_SECRET || 'fallback_jwt_secret_key_your_nexthire';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const adminMiddleware = (req, res, next) => {
  authMiddleware(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access only' });
    }
    next();
  });
};

module.exports = { authMiddleware, adminMiddleware };
