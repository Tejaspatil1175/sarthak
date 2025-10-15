/**
 * AI-BOM Converter - Main Server Entry Point
 * Team Sarthak - L&T Hackathon 2025
 */

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

// Import configurations
import { connectDB } from './config/database.js';
import logger from './utils/logger.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import bomRoutes from './routes/bom.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';

// Import middleware
import errorHandler from './middleware/error.middleware.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ========================================
// Database Connection
// ========================================
connectDB();

// ========================================
// Security Middleware
// ========================================

// Helmet - Set security headers
app.use(helmet());

// CORS - Cross-Origin Resource Sharing
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Rate Limiting - Prevent brute force attacks
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Data Sanitization against NoSQL Injection
app.use(mongoSanitize());

// ========================================
// Body Parser Middleware
// ========================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ========================================
// Compression & Logging Middleware
// ========================================
app.use(compression());

// Morgan - HTTP request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: logger.stream }));
}

// ========================================
// API Routes
// ========================================
const API_PREFIX = process.env.API_PREFIX || '/api';

// Health check endpoint
app.get(`${API_PREFIX}/health`, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI-BOM Converter API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Mount routes
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/bom`, bomRoutes);
app.use(`${API_PREFIX}/analytics`, analyticsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to AI-BOM Converter API',
    version: '1.0.0',
    documentation: `${req.protocol}://${req.get('host')}${API_PREFIX}/docs`,
  });
});

// 404 Handler - Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// ========================================
// Error Handling Middleware
// ========================================
app.use(errorHandler);

// ========================================
// Graceful Shutdown
// ========================================
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  });
});

// ========================================
// Start Server
// ========================================
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}${API_PREFIX}`);
  console.log(`🏥 Health check: http://localhost:${PORT}${API_PREFIX}/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  console.error(`❌ Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

export default app;
