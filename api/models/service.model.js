import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import slugify from 'slugify';

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      unique: true,
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    slug: {
      type: String,
      unique: true
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
        values: [
          'assessments', 
          'compliance', 
          'safeguards', 
          'planning', 
          'sustainability',
          'consulting',
          'training'
        ],
        message: 'Invalid service category'
      }
    },
    features: [{
      title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
      },
      description: {
        type: String,
        required: true,
        trim: true
      },
      icon: {
        type: String,
        default: '✓'
      }
    }],
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
      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
      },
      description: {
        type: String,
        trim: true
      }
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
    isPublished: {
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
    images: [{
      url: String,
      altText: String,
      isPrimary: Boolean
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    versionHistory: [{
      versionNumber: Number,
      data: Object,
      changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      changedAt: {
        type: Date,
        default: Date.now
      },
      changeReason: String
    }],
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

// Middleware to generate slug before saving
serviceSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Middleware to track version history before update
serviceSchema.pre('findOneAndUpdate', async function(next) {
  const service = await this.model.findOne(this.getQuery());
  if (service) {
    const update = this.getUpdate();
    const versionNumber = service.versionHistory.length + 1;
    
    const versionEntry = {
      versionNumber,
      data: { ...service.toObject() },
      changedBy: update.$set.lastUpdatedBy || service.lastUpdatedBy,
      changeReason: update.$set.changeReason || 'General update'
    };
    
    await this.model.findByIdAndUpdate(service._id, {
      $push: { versionHistory: versionEntry }
    });
  }
  next();
});

// Indexes for better performance
serviceSchema.index({ title: 'text', description: 'text', shortDescription: 'text' }, { weights: { title: 10, shortDescription: 5, description: 1 } });
{/*serviceSchema.index({ slug: 1 });*/}
serviceSchema.index({ category: 1 });
serviceSchema.index({ price: 1 });
serviceSchema.index({ isFeatured: 1 });
serviceSchema.index({ isPublished: 1 });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ isDeleted: 1 });

// Virtuals
serviceSchema.virtual('formattedPrice').get(function() {
  return `KES ${this.price.toLocaleString()}`;
});

// Query helper for active services
serviceSchema.query.active = function() {
  return this.where({ isActive: true, isDeleted: false });
};

// Query helper for published services
serviceSchema.query.published = function() {
  return this.where({ isPublished: true, isActive: true, isDeleted: false });
};

// Plugin for pagination
serviceSchema.plugin(mongoosePaginate);

const Service = mongoose.model('Service', serviceSchema);

export default Service;