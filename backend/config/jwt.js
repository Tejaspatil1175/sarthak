/**
 * JWT Configuration
 */

import jwt from 'jsonwebtoken';

// JWT configuration constants
export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  expiresIn: process.env.JWT_EXPIRE || '7d',
  cookieExpire: parseInt(process.env.JWT_COOKIE_EXPIRE) || 7,
};

/**
 * Generate JWT token
 * @param {string} userId - User ID
 * @returns {string} JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_CONFIG.secret, {
    expiresIn: JWT_CONFIG.expiresIn,
  });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {object} Decoded token payload
 */
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_CONFIG.secret);
};

/**
 * Set JWT token in cookie
 * @param {object} res - Express response object
 * @param {string} token - JWT token
 */
export const setTokenCookie = (res, token) => {
  const options = {
    expires: new Date(Date.now() + JWT_CONFIG.cookieExpire * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS in production
    sameSite: 'strict',
  };

  res.cookie('token', token, options);
};

export default {
  JWT_CONFIG,
  generateToken,
  verifyToken,
  setTokenCookie,
};
