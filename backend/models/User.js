/**
 * User Model
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    company: {
      type: String,
      trim: true,
      maxlength: [100, 'Company name cannot be more than 100 characters'],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
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
userSchema.index({ email: 1 });

// ========================================
// Virtual Fields
// ========================================

// Virtual for user's BOMs
userSchema.virtual('boms', {
  ref: 'BOM',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
});

// ========================================
// Middleware - Hash password before saving
// ========================================
userSchema.pre('save', async function (next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ========================================
// Instance Methods
// ========================================

/**
 * Compare entered password with hashed password
 * @param {string} enteredPassword - Password to compare
 * @returns {Promise<boolean>}
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Update last login timestamp
 */
userSchema.methods.updateLastLogin = async function () {
  this.lastLogin = Date.now();
  await this.save({ validateBeforeSave: false });
};

/**
 * Get user profile (without sensitive data)
 */
userSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    company: this.company,
    phone: this.phone,
    isActive: this.isActive,
    createdAt: this.createdAt,
    lastLogin: this.lastLogin,
  };
};

// ========================================
// Static Methods
// ========================================

/**
 * Find user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
userSchema.statics.findByEmail = async function (email) {
  return await this.findOne({ email: email.toLowerCase() });
};

/**
 * Get active users count
 * @returns {Promise<number>}
 */
userSchema.statics.getActiveUsersCount = async function () {
  return await this.countDocuments({ isActive: true });
};

const User = mongoose.model('User', userSchema);

export default User;
