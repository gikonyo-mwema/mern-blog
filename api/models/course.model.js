import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      minlength: 5,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9-]+$/, 'Slug can only contain letters, numbers and hyphens']
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: 150
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: [true, 'Course price is required'],
      min: [0, 'Price must be a positive number'],
    },
    externalUrl: {
      type: String,
      required: [true, 'External URL is required'],
      match: [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'Please enter a valid URL']
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    paymentOption: {
      type: String,
      enum: ['one-time', 'subscription'],
      default: 'one-time'
    },
    features: {
      type: [String],
      required: [true, 'At least one feature is required'],
      validate: {
        validator: features => features.length > 0,
        message: 'At least one feature is required'
      }
    },
    cta: {
      type: String,
      default: 'Enroll Now',
      maxlength: 50,
    },
    iconName: {
      type: String,
      default: 'HiOutlineAcademicCap'
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Remove auto-slug generation since we'll validate it manually
// Indexes for better query performance
courseSchema.index({ title: 1, slug: 1, isPopular: 1 });

const Course = mongoose.model('Course', courseSchema);

export default Course;