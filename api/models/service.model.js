import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      unique: true,
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
      maxlength: [200, 'Short description cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    fullDescription: {
      type: String,
      required: [true, 'Full description is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['assessments', 'compliance', 'safeguards', 'planning', 'sustainability'],
        message: 'Invalid service category'
      }
    },
    features: {
      type: [String],
      required: [true, 'At least one feature is required'],
      validate: {
        validator: function(features) {
          return features.length > 0;
        },
        message: 'At least one feature is required'
      }
    },
    icon: {
      type: String,
      default: '📋',
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
      default: 0
    },
    priceNote: {
      type: String,
      trim: true,
      maxlength: [100, 'Price note cannot exceed 100 characters']
    },
    heroText: {
      type: String,
      trim: true,
      maxlength: [200, 'Hero text cannot exceed 200 characters'],
      default: function() {
        return `Professional ${this.title} services`;
      }
    },
    introduction: {
      type: String,
      trim: true,
      default: function() {
        return this.description;
      }
    },
    processSteps: [{
      title: {
        type: String,
        required: [true, 'Process step title is required'],
        trim: true,
        maxlength: [100, 'Step title cannot exceed 100 characters']
      },
      description: {
        type: String,
        required: [true, 'Process step description is required'],
        trim: true
      },
      order: {
        type: Number,
        min: 1
      }
    }],
    projectTypes: [{
      type: String,
      trim: true,
      maxlength: [100, 'Project type cannot exceed 100 characters']
    }],
    benefits: [{
      title: {
        type: String,
        required: [true, 'Benefit title is required'],
        trim: true,
        maxlength: [100, 'Benefit title cannot exceed 100 characters']
      },
      description: {
        type: String,
        required: [true, 'Benefit description is required'],
        trim: true
      },
      icon: {
        type: String,
        trim: true,
        default: '✅'
      }
    }],
    contactInfo: {
      email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
          validator: function(v) {
            return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
          },
          message: 'Please enter a valid email'
        }
      },
      phone: {
        type: String,
        trim: true,
        validate: {
          validator: function(v) {
            return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(v);
          },
          message: 'Please enter a valid phone number'
        }
      },
      website: {
        type: String,
        trim: true,
        validate: {
          validator: function(v) {
            return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
          },
          message: 'Please enter a valid website URL'
        }
      }
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    calendlyLink: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
        },
        message: 'Please enter a valid URL'
      }
    },
    socialLinks: [{
      platform: {
        type: String,
        required: true,
        enum: ['twitter', 'facebook', 'linkedin', 'instagram', 'youtube', 'other']
      },
      url: {
        type: String,
        required: true,
        trim: true,
        validate: {
          validator: function(v) {
            return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
          },
          message: 'Please enter a valid URL'
        }
      }
    }],
    image: {
      type: String,
      trim: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better performance
serviceSchema.index({ title: 'text', description: 'text', shortDescription: 'text' });
serviceSchema.index({ category: 1 });
serviceSchema.index({ price: 1 });
serviceSchema.index({ isFeatured: 1 });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ isDeleted: 1 });

// Virtual for formatted price
serviceSchema.virtual('formattedPrice').get(function() {
  return `KES ${this.price.toLocaleString()}`;
});

// Query middleware for soft delete
serviceSchema.pre(/^find/, function(next) {
  if (this._conditions.isDeleted !== true) {
    this.where({ isDeleted: { $ne: true } });
  }
  next();
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;