import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true, enum: ['card', 'mobile_money'] },
    transactionId: { type: String, required: true, unique: true },
    status: { type: String, default: 'pending', enum: ['pending', 'completed', 'failed'] },
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);