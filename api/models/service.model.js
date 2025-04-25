import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['assessments', 'compliance', 'safeguards', 'planning', 'sustainability'],
    },
    features: {
      type: [String],
      required: true,
    },
    fullDescription: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: '📋',
    },
  },
  { timestamps: true }
);

const Service = mongoose.model('Service', serviceSchema);

export default Service;