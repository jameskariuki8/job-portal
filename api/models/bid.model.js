import mongoose from 'mongoose';
const { Schema } = mongoose;

const BidSchema = new Schema({
  gigId: {
    type: String,
    required: true,
  },
  bidderId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  days: {
    type: Number,
    required: true,
    min: 1,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'in_progress', 'completed'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

export default mongoose.model('Bid', BidSchema);


