import UserReview from '../models/userReview.model.js';
import Bid from '../models/bid.model.js';
import Gig from '../models/gig.model.js';
import createError from '../utils/createError.js';

export const createUserReview = async (req, res, next) => {
  try {
    const { bidId, stars, satisfaction, comment } = req.body;
    if (!bidId || !stars || !satisfaction || !comment) {
      return next(createError(400, 'Missing fields'));
    }
    const bid = await Bid.findById(bidId);
    if (!bid) return next(createError(404, 'Bid not found'));
    const gig = await Gig.findById(bid.gigId);
    if (!gig) return next(createError(404, 'Gig not found'));
    if (gig.userId !== req.userId) return next(createError(403, 'Only owner can review'));

    const existing = await UserReview.findOne({ bidId });
    if (existing) return next(createError(409, 'Review already submitted'));

    const review = await UserReview.create({
      ratedUserId: bid.bidderId,
      reviewerId: req.userId,
      gigId: gig._id,
      bidId,
      stars,
      satisfaction,
      comment,
    });
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

export const listUserReviewsForUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const reviews = await UserReview.find({ ratedUserId: userId }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
};


