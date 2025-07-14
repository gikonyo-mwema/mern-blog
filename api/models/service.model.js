import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true,
    required: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  fullDescription: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'default-service-icon.svg'
  },
  benefits: [{
    title: String,
    description: String
  }],
  examples: [String],
  faqs: [{
    question: String,
    answer: String
  }]
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);

export default Service;
