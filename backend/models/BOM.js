/**
 * BOM (Bill of Materials) Model
 */

import mongoose from 'mongoose';

const componentSchema = new mongoose.Schema(
  {
    partNo: {
      type: String,
      required: [true, 'Part number is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    unit: {
      type: String,
      default: 'EA',
      trim: true,
    },
    material: {
      type: String,
      trim: true,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
    parentPartNo: {
      type: String,
      trim: true,
    },
    // Manufacturing details (populated by AI)
    workCenter: {
      type: String,
      trim: true,
    },
    operation: {
      type: String,
      trim: true,
    },
    supplier: {
      type: String,
      trim: true,
    },
    cost: {
      type: Number,
      min: 0,
    },
    leadTime: {
      type: Number,
      min: 0,
    },
    // Additional metadata
    category: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const bomSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'BOM name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    type: {
      type: String,
      enum: ['eBOM', 'mBOM'],
      default: 'eBOM',
    },
    status: {
      type: String,
      enum: ['uploaded', 'processing', 'completed', 'failed', 'archived'],
      default: 'uploaded',
      index: true,
    },
    // Original file information
    originalFile: {
      filename: String,
      originalName: String,
      mimetype: String,
      size: Number,
      path: String,
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
    // eBOM data (input)
    eBOMData: [componentSchema],
    // mBOM data (output from AI)
    mBOMData: [componentSchema],
    // Conversion metadata
    conversionMetadata: {
      aiConfidence: {
        type: Number,
        min: 0,
        max: 100,
      },
      processingTime: {
        type: Number, // in milliseconds
      },
      startedAt: Date,
      completedAt: Date,
      aiModel: {
        type: String,
        default: 'TensorFlow + LangChain',
      },
      errorMessage: String,
    },
    // Analytics
    analytics: {
      totalParts: {
        type: Number,
        default: 0,
      },
      totalCost: {
        type: Number,
        default: 0,
      },
      averageLeadTime: {
        type: Number,
        default: 0,
      },
      uniqueSuppliers: {
        type: Number,
        default: 0,
      },
    },
    // Version control
    version: {
      type: Number,
      default: 1,
    },
    parentBOM: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BOM',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ========================================
// Indexes
// ========================================
bomSchema.index({ user: 1, createdAt: -1 });
bomSchema.index({ status: 1, createdAt: -1 });
bomSchema.index({ name: 'text', description: 'text' });

// ========================================
// Middleware
// ========================================

// Pre-save middleware to calculate analytics
bomSchema.pre('save', function (next) {
  if (this.mBOMData && this.mBOMData.length > 0) {
    // Calculate total parts
    this.analytics.totalParts = this.mBOMData.length;

    // Calculate total cost
    this.analytics.totalCost = this.mBOMData.reduce(
      (sum, component) => sum + (component.cost || 0) * (component.quantity || 1),
      0
    );

    // Calculate average lead time
    const leadTimes = this.mBOMData
      .map((c) => c.leadTime)
      .filter((lt) => lt !== undefined && lt !== null);
    this.analytics.averageLeadTime =
      leadTimes.length > 0
        ? leadTimes.reduce((sum, lt) => sum + lt, 0) / leadTimes.length
        : 0;

    // Count unique suppliers
    const suppliers = new Set(
      this.mBOMData.map((c) => c.supplier).filter((s) => s !== undefined && s !== null)
    );
    this.analytics.uniqueSuppliers = suppliers.size;
  }
  next();
});

// ========================================
// Instance Methods
// ========================================

/**
 * Mark BOM as processing
 */
bomSchema.methods.markAsProcessing = async function () {
  this.status = 'processing';
  this.conversionMetadata.startedAt = Date.now();
  await this.save();
};

/**
 * Mark BOM as completed
 * @param {Object} metadata - Conversion metadata
 */
bomSchema.methods.markAsCompleted = async function (metadata = {}) {
  this.status = 'completed';
  this.type = 'mBOM';
  this.conversionMetadata.completedAt = Date.now();
  this.conversionMetadata.processingTime =
    this.conversionMetadata.completedAt - this.conversionMetadata.startedAt;
  this.conversionMetadata.aiConfidence = metadata.aiConfidence || 0;
  await this.save();
};

/**
 * Mark BOM as failed
 * @param {string} errorMessage - Error message
 */
bomSchema.methods.markAsFailed = async function (errorMessage) {
  this.status = 'failed';
  this.conversionMetadata.errorMessage = errorMessage;
  await this.save();
};

/**
 * Get summary of BOM
 */
bomSchema.methods.getSummary = function () {
  return {
    id: this._id,
    name: this.name,
    type: this.type,
    status: this.status,
    totalParts: this.analytics.totalParts,
    totalCost: this.analytics.totalCost,
    averageLeadTime: this.analytics.averageLeadTime,
    uniqueSuppliers: this.analytics.uniqueSuppliers,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// ========================================
// Static Methods
// ========================================

/**
 * Get user's BOMs with pagination
 * @param {string} userId
 * @param {number} page
 * @param {number} limit
 */
bomSchema.statics.getUserBOMs = async function (userId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const boms = await this.find({ user: userId, isArchived: false })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('-eBOMData -mBOMData');

  const total = await this.countDocuments({ user: userId, isArchived: false });

  return {
    boms,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
    },
  };
};

/**
 * Get BOM statistics for a user
 * @param {string} userId
 */
bomSchema.statics.getUserStats = async function (userId) {
  const stats = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId), isArchived: false } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalCost: { $sum: '$analytics.totalCost' },
        avgProcessingTime: { $avg: '$conversionMetadata.processingTime' },
      },
    },
  ]);

  return stats;
};

const BOM = mongoose.model('BOM', bomSchema);

export default BOM;
