import Bid from '../models/bid.model.js';
import Gig from '../models/gig.model.js';
import createError from '../utils/createError.js';

export const createBid = async (req, res, next) => {
  try {
    const { gigId, amount, message, days } = req.body;
    if (!gigId || amount == null || !days || !message) {
      return next(createError(400, 'gigId, amount, days and message are required'));
    }
    const gig = await Gig.findById(gigId);
    if (!gig) return next(createError(404, 'Gig not found'));
    if (gig.userId === req.userId) return next(createError(403, 'Owner cannot bid on own gig'));

    if (gig.status === 'completed' || gig.status === 'in_progress') {
      return next(createError(400, 'Bidding is closed for this gig'));
    }

    // Validate ranges
    if (amount < gig.priceMin || amount > gig.priceMax) {
      return next(createError(400, `Amount must be between ${gig.priceMin} and ${gig.priceMax}`));
    }
    if (days < 1 || days > gig.deliveryTime) {
      return next(createError(400, `Days must be between 1 and ${gig.deliveryTime}`));
    }
    if (String(message).trim().length < 100) {
      return next(createError(400, 'Proposal must be at least 100 characters'));
    }

    const existing = await Bid.findOne({ gigId, bidderId: req.userId, status: 'pending' });
    if (existing) return next(createError(409, 'You already have a pending bid'));

    const bid = new Bid({ gigId, bidderId: req.userId, amount, message, days });
    const saved = await bid.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

export const listBidsForGig = async (req, res, next) => {
  try {
    const { id } = req.params; // gig id
    const gig = await Gig.findById(id);
    if (!gig) return next(createError(404, 'Gig not found'));
    if (gig.userId !== req.userId) return next(createError(403, 'Only owner can view bids'));
    const bids = await Bid.find({ gigId: id }).sort({ createdAt: -1 });
    res.status(200).json(bids);
  } catch (err) {
    next(err);
  }
};

export const countBidsForGig = async (req, res, next) => {
  try {
    const { id } = req.params; // gig id
    const count = await Bid.countDocuments({ gigId: id });
    res.status(200).json({ count });
  } catch (err) {
    next(err);
  }
};

export const approveBid = async (req, res, next) => {
  try {
    const { bidId } = req.params;
    const bid = await Bid.findById(bidId);
    if (!bid) return next(createError(404, 'Bid not found'));
    const gig = await Gig.findById(bid.gigId);
    if (!gig) return next(createError(404, 'Gig not found'));
    if (gig.userId !== req.userId) return next(createError(403, 'Only owner can approve'));

    // Allow multiple approvals: do NOT reject other bids
    bid.status = 'in_progress';
    await bid.save();

    // Ensure gig is in progress
    if (gig.status !== 'in_progress') {
      gig.status = 'in_progress';
      await gig.save();
    }

    res.status(200).json({ message: 'Bid approved; gig in progress', bid, gig });
  } catch (err) {
    next(err);
  }
};

export const completeGigFromApprovedBid = async (req, res, next) => {
  try {
    const { bidId } = req.params;
    const bid = await Bid.findById(bidId);
    if (!bid) return next(createError(404, 'Bid not found'));
    const gig = await Gig.findById(bid.gigId);
    if (!gig) return next(createError(404, 'Gig not found'));
    if (gig.userId !== req.userId) return next(createError(403, 'Only owner can complete gig'));

    // Only allowed if currently in progress
    if (gig.status !== 'in_progress' || bid.status !== 'in_progress') {
      return next(createError(400, 'Gig is not in progress'));
    }

    bid.status = 'completed';
    await bid.save();
    gig.status = 'completed';
    await gig.save();

    res.status(200).json({ message: 'Gig completed', bid, gig });
  } catch (err) {
    next(err);
  }
};

export const getMyBidsForGig = async (req, res, next) => {
  try {
    const { id } = req.params; // gig id
    const bids = await Bid.find({ gigId: id, bidderId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(bids);
  } catch (err) {
    next(err);
  }
};

export const listPendingBidsForOwner = async (req, res, next) => {
  try {
    // find gigs owned by current user
    const ownerGigs = await Gig.find({ userId: req.userId }, { _id: 1, title: 1, cover: 1 });
    const gigIdList = ownerGigs.map(g => String(g._id));
    if (gigIdList.length === 0) return res.status(200).json([]);

    const bids = await Bid.find({ gigId: { $in: gigIdList }, status: { $in: ['pending', 'approved', 'in_progress'] } }).sort({ createdAt: -1 });
    const gigIdToInfo = Object.fromEntries(ownerGigs.map(g => [String(g._id), { title: g.title, cover: g.cover }]));

    // fetch bidder usernames
    const bidderIds = [...new Set(bids.map(b => b.bidderId))];
    const Users = (await import('../models/user.model.js')).default;
    const bidders = await Users.find(
      { _id: { $in: bidderIds } },
      { _id: 1, username: 1, img: 1, country: 1, nationality: 1, education: 1, certifications: 1, experience: 1, bio: 1, fullName: 1 }
    );
    const bidderMap = Object.fromEntries(bidders.map(u => [String(u._id), {
      username: u.username,
      img: u.img,
      country: u.country,
      nationality: u.nationality,
      education: u.education,
      certifications: u.certifications,
      experience: u.experience,
      bio: u.bio,
      fullName: u.fullName,
    }]));

    const result = bids.map(b => ({
      _id: b._id,
      gigId: b.gigId,
      bidderId: b.bidderId,
      bidderUsername: bidderMap[b.bidderId]?.username || b.bidderId,
      bidderProfile: bidderMap[b.bidderId] || null,
      amount: b.amount,
      days: b.days,
      message: b.message,
      status: b.status,
      createdAt: b.createdAt,
      gig: gigIdToInfo[b.gigId] || null,
    }));

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const listCompletedBidsForOwner = async (req, res, next) => {
  try {
    const ownerGigs = await Gig.find({ userId: req.userId }, { _id: 1, title: 1, cover: 1 });
    const gigIdList = ownerGigs.map(g => String(g._id));
    if (gigIdList.length === 0) return res.status(200).json([]);

    const bids = await Bid.find({ gigId: { $in: gigIdList }, status: 'completed' }).sort({ createdAt: -1 });
    const gigIdToInfo = Object.fromEntries(ownerGigs.map(g => [String(g._id), { title: g.title, cover: g.cover }]));

    const bidderIds = [...new Set(bids.map(b => b.bidderId))];
    const Users = (await import('../models/user.model.js')).default;
    const bidders = await Users.find(
      { _id: { $in: bidderIds } },
      { _id: 1, username: 1, img: 1 }
    );
    const bidderMap = Object.fromEntries(bidders.map(u => [String(u._id), { username: u.username, img: u.img }]));

    const result = bids.map(b => ({
      _id: b._id,
      gigId: b.gigId,
      bidderId: b.bidderId,
      bidderUsername: bidderMap[b.bidderId]?.username || b.bidderId,
      bidderProfile: bidderMap[b.bidderId] || null,
      amount: b.amount,
      days: b.days,
      message: b.message,
      status: b.status,
      createdAt: b.createdAt,
      gig: gigIdToInfo[b.gigId] || null,
    }));

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const listMyBids = async (req, res, next) => {
  try {
    const bids = await Bid.find({ bidderId: req.userId }).sort({ createdAt: -1 });
    // decorate with gig info
    const gigIds = [...new Set(bids.map(b => b.gigId))];
    const gigs = await Gig.find({ _id: { $in: gigIds } }, { _id: 1, title: 1, cover: 1, userId: 1, status: 1 });
    const map = Object.fromEntries(gigs.map(g => [String(g._id), { title: g.title, cover: g.cover, userId: g.userId, status: g.status }]));

    // fetch owner usernames
    const ownerIds = [...new Set(gigs.map(g => g.userId))];
    const Users = (await import('../models/user.model.js')).default;
    const owners = await Users.find({ _id: { $in: ownerIds } }, { _id: 1, username: 1 });
    const ownerMap = Object.fromEntries(owners.map(u => [String(u._id), u.username]));

    const result = bids.map(b => ({
      _id: b._id,
      gigId: b.gigId,
      amount: b.amount,
      days: b.days,
      message: b.message,
      status: b.status,
      createdAt: b.createdAt,
      gig: map[b.gigId] || null,
      sellerId: map[b.gigId]?.userId || null,
      sellerUsername: map[b.gigId]?.userId ? (ownerMap[map[b.gigId].userId] || map[b.gigId].userId) : null,
    }));
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}


