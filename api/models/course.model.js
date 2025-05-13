import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      unique: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
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
    isPopular: {
      type: Boolean,
      default: false,
    },
    paymentOption: {
      type: String,
      trim: true,
      maxlength: 100,
      // e.g. "or 2 payments of KES 10,000"
    },
    features: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: 'At least one feature is required',
      },
    },
    cta: {
      type: String,
      default: 'Enroll Now',
      maxlength: 50,
    },
    thumbnail: {
      type: String, // URL to image
      default: '',
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

// Auto-generate slug from title
courseSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

const Course = mongoose.model('Course', courseSchema);

export default Course;
