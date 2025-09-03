import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserReviewSchema = new Schema({
  ratedUserId: { type: String, required: true }, // bidder being rated
  reviewerId: { type: String, required: true }, // gig owner
  gigId: { type: String, required: true },
  bidId: { type: String, required: true },
  stars: { type: Number, min: 1, max: 5, required: true },
  satisfaction: { type: String, enum: ['poor','fair','good','very_good','excellent'], required: true },
  comment: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('UserReview', UserReviewSchema);


