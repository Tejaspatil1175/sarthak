/**
 * MongoDB Database Configuration
 */

import mongoose from 'mongoose';
import logger from '../utils/logger.js';

/**
 * Connect to MongoDB
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Mongoose 6+ handles these options automatically
      // No need to specify useNewUrlParser, useUnifiedTopology, etc.
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Connection event listeners
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      logger.error(`Mongoose connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected from MongoDB');
    });

    return conn;
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB
 */
export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB disconnected successfully');
    console.log('✅ MongoDB disconnected successfully');
  } catch (error) {
    logger.error(`MongoDB Disconnection Error: ${error.message}`);
    console.error(`❌ MongoDB Disconnection Error: ${error.message}`);
    throw error;
  }
};

export default { connectDB, disconnectDB };
