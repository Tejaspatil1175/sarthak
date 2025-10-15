/**
 * Conversion History Model
 */

import mongoose from 'mongoose';

const conversionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    bom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BOM',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['success', 'failed', 'partial'],
      required: true,
    },
    // Conversion details
    inputFormat: {
      type: String,
      enum: ['xlsx', 'xls', 'csv', 'json'],
      required: true,
    },
    outputFormat: {
      type: String,
      enum: ['xlsx', 'csv', 'json'],
      required: true,
    },
    totalComponents: {
      type: Number,
      required: true,
      min: 0,
    },
    successfulComponents: {
      type: Number,
      required: true,
      min: 0,
    },
    failedComponents: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Performance metrics
    performance: {
      uploadTime: {
        type: Number, // milliseconds
        required: true,
      },
      processingTime: {
        type: Number, // milliseconds
        required: true,
      },
      totalTime: {
        type: Number, // milliseconds
        required: true,
      },
    },
    // AI metrics
    aiMetrics: {
      modelVersion: {
        type: String,
        default: 'v1.0',
      },
      averageConfidence: {
        type: Number,
        min: 0,
        max: 100,
      },
      classificationsPerSecond: {
        type: Number,
      },
    },
    // Error tracking
    errors: [
      {
        componentId: String,
        partNo: String,
        errorType: String,
        errorMessage: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Additional metadata
    metadata: {
      ipAddress: String,
      userAgent: String,
      fileSize: Number, // bytes
      exportSize: Number, // bytes
    },
  },
  {
    timestamps: true,
  }
);

// ========================================
// Indexes
// ========================================
conversionSchema.index({ user: 1, createdAt: -1 });
conversionSchema.index({ status: 1, createdAt: -1 });
conversionSchema.index({ bom: 1 });

// ========================================
// Instance Methods
// ========================================

/**
 * Get conversion success rate
 */
conversionSchema.methods.getSuccessRate = function () {
  if (this.totalComponents === 0) return 0;
  return (this.successfulComponents / this.totalComponents) * 100;
};

/**
 * Get conversion summary
 */
conversionSchema.methods.getSummary = function () {
  return {
    id: this._id,
    status: this.status,
    successRate: this.getSuccessRate(),
    totalComponents: this.totalComponents,
    successfulComponents: this.successfulComponents,
    failedComponents: this.failedComponents,
    totalTime: this.performance.totalTime,
    createdAt: this.createdAt,
  };
};

// ========================================
// Static Methods
// ========================================

/**
 * Get conversion statistics for a user
 * @param {string} userId
 * @param {number} days - Number of days to look back
 */
conversionSchema.statics.getUserConversionStats = async function (userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const stats = await this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgProcessingTime: { $avg: '$performance.processingTime' },
        totalComponents: { $sum: '$totalComponents' },
        successfulComponents: { $sum: '$successfulComponents' },
      },
    },
  ]);

  return stats;
};

/**
 * Get daily conversion trends
 * @param {string} userId
 * @param {number} days
 */
conversionSchema.statics.getDailyTrends = async function (userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const trends = await this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
        },
        count: { $sum: 1 },
        avgProcessingTime: { $avg: '$performance.processingTime' },
        totalComponents: { $sum: '$totalComponents' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return trends;
};

const Conversion = mongoose.model('Conversion', conversionSchema);

export default Conversion;
