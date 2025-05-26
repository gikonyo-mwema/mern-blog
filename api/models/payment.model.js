import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    itemType: {
      type: String,
      required: true,
      enum: ['course', 'service'] // Add other types as needed
    },
    amount: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['pesapal', 'flutterwave']
    },
    reference: {
      type: String,
      required: true,
      unique: true
    },
    transactionId: {
      type: String
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    paymentDetails: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1, itemId: 1 });
paymentSchema.index({ reference: 1 }, { unique: true });

export default mongoose.model('Payment', paymentSchema);