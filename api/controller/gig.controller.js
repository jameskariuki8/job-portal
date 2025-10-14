import Gig from '../models/gig.model.js';
import createError from '../utils/createError.js';
export const createGig = async (req, res, next) => {
  if (req.isSeller === false) { return next(createError(403, 'Only Seller Create a Gig')); }

  const newGig = new Gig({
    userId: req.userId,
    ...req.body
  })
  console.log('Creating gig with data:', req.body);
  console.log('Category:', req.body.cat);
  try {
    const savedGig = await newGig.save();
    console.log('Saved gig:', savedGig);
    res.status(201).json(savedGig);
  } catch (error) {
    console.error('Error creating gig:', error);
    next(error);
  }
};

export const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (gig.userId !== req.userId) next(403, 'you can delete your gig');
  } catch (err) {
    next(err);
  }
  await Gig.findOneAndDelete(req.params.id);
  res.status(200).send('gig has been deleted');
};

export const getGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return next(createError(404, 'Gig not found'));
    res.status(200).send(gig);
  } catch (err) {
    next(err);
  }
};

export const getGigs = async (req, res, next) => {
  const q = req.query;
  console.log('Query parameters received:', q);
  
  // Decode URL-encoded parameters
  const decodedCat = q.cat ? decodeURIComponent(q.cat) : null;
  const decodedSearch = q.search ? decodeURIComponent(q.search) : null;
  
  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(decodedCat && { cat: decodedCat }),
    ...((q.min || q.max) && {
      priceMin: {
        ...(q.min && { $gte: parseFloat(q.min) }),
        ...(q.max && { $lte: parseFloat(q.max) }),
      },
    }),
    ...(decodedSearch && { title: { $regex: decodedSearch, $options: "i" } }),
    // Only show available gigs (not in progress or completed)
    ...(q.status ? {} : { status: 'available' })
  };
  
  console.log('Applied filters:', filters);
  console.log('Decoded category:', decodedCat);
  
  try {
    const gigs = await Gig.find(filters).sort({ [q.sort]: -1 });
    console.log(`Found ${gigs.length} gigs for category: ${decodedCat}`);
    if (gigs.length > 0) {
      console.log('Sample gig category:', gigs[0].cat);
    }
    res.status(200).send(gigs);
  } catch (err) {
    console.error('Error fetching gigs:', err);
    next(err);
  }
};

export const updateGigStatus = async (req, res, next) => {
  try {
    const { gigId } = req.params;
    const { status } = req.body;
    
    // Verify the user owns this gig
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return next(createError(404, 'Gig not found'));
    }
    
    if (gig.userId !== req.userId) {
      return next(createError(403, 'You can only update your own gigs'));
    }
    
    // Validate status
    if (!['available', 'in_progress', 'completed'].includes(status)) {
      return next(createError(400, 'Invalid status'));
    }
    
    const updatedGig = await Gig.findByIdAndUpdate(
      gigId,
      { status },
      { new: true }
    );
    
    res.status(200).json(updatedGig);
  } catch (err) {
    next(err);
  }
};

export const toggleLikeGig = async (req, res, next) => {
  try {
    const gigId = req.params.id;
    const userId = req.userId;
    const gig = await Gig.findById(gigId);
    if (!gig) return next(createError(404, 'Gig not found'));
    const idx = gig.likedBy.findIndex(id => String(id) === String(userId));
    if (idx >= 0) {
      gig.likedBy.splice(idx, 1);
    } else {
      gig.likedBy.push(String(userId));
    }
    const saved = await gig.save();
    res.status(200).json({ liked: idx < 0, likes: saved.likedBy.length });
  } catch (err) {
    next(err);
  }
}

export const getSellerStats = async (req, res, next) => {
  try {
    const userId = req.userId;
    
    // Get total gigs
    const totalGigs = await Gig.countDocuments({ userId });
    
    // Get active orders (bids that are pending or in progress)
    const Bid = (await import('../models/bid.model.js')).default;
    const activeOrders = await Bid.countDocuments({ 
      sellerId: userId, 
      status: { $in: ['pending', 'approved', 'in_progress'] } 
    });
    
    // Get total revenue (sum of completed bids)
    const completedBids = await Bid.find({ 
      sellerId: userId, 
      status: 'completed' 
    });
    const totalRevenue = completedBids.reduce((sum, bid) => sum + (bid.amount || 0), 0);
    
    // Get recent gigs
    const recentGigs = await Gig.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title cover cat priceMin priceMax status createdAt');
    
    res.status(200).json({
      totalGigs,
      activeOrders,
      totalRevenue,
      recentGigs
    });
  } catch (err) {
    next(err);
  }
};
