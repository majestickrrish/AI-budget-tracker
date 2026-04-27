const { verifyToken } = require('../utils/jwt');
const { sendError } = require('../utils/response');

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, {
        statusCode: 401,
        message: 'Access denied. No token provided.',
        code: 'NO_TOKEN',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return sendError(res, {
        statusCode: 401,
        message: 'Access denied. Token is malformed.',
        code: 'MALFORMED_TOKEN',
      });
    }

    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, {
        statusCode: 401,
        message: 'Token has expired. Please login again.',
        code: 'TOKEN_EXPIRED',
      });
    }
    return sendError(res, {
      statusCode: 401,
      message: 'Invalid token.',
      code: 'INVALID_TOKEN',
    });
  }
};

module.exports = { protect };