import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    shortDescription: {
      type: String,
      required: true,
      maxlength: 160
    },
    fullDescription: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: ['assessments', 'compliance', 'safeguards', 'planning', 'sustainability'],
      index: true
    },
    features: {
      type: [String],
      required: true,
      validate: {
        validator: function(features) {
          return features.length > 0 && 
                 features.every(f => typeof f === 'string' && f.trim().length > 0);
        },
        message: 'At least one valid feature is required'
      }
    },
    icon: {
      type: String,
      default: '📋'
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    calendlyLink: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https:\/\/calendly\.com\//.test(v);
        },
        message: 'Must be a valid Calendly URL'
      }
    },
    contactEmail: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Must be a valid email'
      }
    },
    contactPhone: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^\+?[\d\s\-()]+$/.test(v);
        },
        message: 'Must be a valid phone number'
      }
    },
    socialLinks: [{
      platform: {
        type: String,
        enum: ['twitter', 'facebook', 'linkedin', 'instagram', 'youtube'],
        required: true
      },
      url: {
        type: String,
        required: true,
        validate: {
          validator: function(v) {
            return /^https?:\/\//.test(v);
          },
          message: 'Must be a valid URL'
        }
      }
    }],
    isFeatured: {
      type: Boolean,
      default: false
    },
    viewCount: {
      type: Number,
      default: 0
    },
    meta: {
      title: String,
      description: String,
      keywords: [String]
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { 
    timestamps: true,
    toJSON: { 
      virtuals: true,
      transform: function(doc, ret) {
        delete ret.__v;
        return ret;
      }
    },
    toObject: { 
      virtuals: true,
      transform: function(doc, ret) {
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Indexes
serviceSchema.index({ title: 'text', shortDescription: 'text', fullDescription: 'text' });
serviceSchema.index({ isFeatured: 1 });
serviceSchema.index({ category: 1, isFeatured: 1 });
serviceSchema.index({ price: 1 });
serviceSchema.index({ createdAt: -1 });

const Service = mongoose.model('Service', serviceSchema);

export default Service;