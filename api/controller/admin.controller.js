import User from '../models/user.model.js';
import Gig from '../models/gig.model.js';

export const getOverview = async (req, res, next) => {
  try {
    const [users, gigs] = await Promise.all([
      User.find({}).select('username email isSeller verified createdAt'),
      Gig.find({}).select('title cat userId status priceMin priceMax createdAt'),
    ]);

    // Map userId to basic creator info for gigs
    const userIdToUser = new Map(users.map(u => [String(u._id), u]));
    const gigsWithCreators = gigs.map(g => ({
      ...g.toObject(),
      creator: userIdToUser.get(String(g.userId)) ? {
        _id: userIdToUser.get(String(g.userId))._id,
        username: userIdToUser.get(String(g.userId)).username,
        email: userIdToUser.get(String(g.userId)).email,
      } : null,
    }));

    res.status(200).json({ users, gigs: gigsWithCreators });
  } catch (err) { next(err); }
};

export const listUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('username email isSeller verified createdAt');
    res.status(200).json(users);
  } catch (err) { next(err); }
};

export const listGigs = async (req, res, next) => {
  try {
    const gigs = await Gig.find({}).select('title cat userId status priceMin priceMax createdAt');
    res.status(200).json(gigs);
  } catch (err) { next(err); }
};

export const adminDeleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).send('user deleted');
  } catch (err) { next(err); }
};

export const adminDeleteGig = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Gig.findByIdAndDelete(id);
    res.status(200).send('gig deleted');
  } catch (err) { next(err); }
};


