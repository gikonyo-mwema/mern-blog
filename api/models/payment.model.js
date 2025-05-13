import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['mpesa', 'card'],
      required: true
    },
    phoneNumber: {
      type: String,
      required: function() {
        return this.paymentMethod === 'mpesa';
      }
    },
    cardDetails: {
      number: String,
      expiry: String,
      cvv: String,
      name: String
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    transactionReference: {
      type: String,
      unique: true
    },
    mpesaCode: String // For M-Pesa transactions
  },
  { timestamps: true }
);

// Add indexes for better query performance
paymentSchema.index({ user: 1 });
paymentSchema.index({ course: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: 1 });

// Static method for payment metrics
paymentSchema.statics.getPaymentMetrics = async function() {
  const totalRevenue = await this.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  
  const lastMonthRevenue = await this.aggregate([
    { 
      $match: { 
        status: 'completed',
        createdAt: { $gte: lastMonth } 
      } 
    },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  return {
    totalRevenue: totalRevenue[0]?.total || 0,
    lastMonthRevenue: lastMonthRevenue[0]?.total || 0
  };
};

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;