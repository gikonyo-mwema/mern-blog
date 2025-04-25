import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: String,
      required: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    paymentOption: {
      type: String,
    },
    features: {
      type: [String],
      required: true,
    },
    cta: {
      type: String,
      default: 'Enroll Now',
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', courseSchema);

export default Course;