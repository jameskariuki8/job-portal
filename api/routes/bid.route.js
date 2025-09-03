import express from 'express';
import { verifyToken } from '../middelware/jwt.js';
import { createBid, listBidsForGig, approveBid, getMyBidsForGig, listPendingBidsForOwner, listMyBids, completeGigFromApprovedBid, countBidsForGig, listCompletedBidsForOwner } from '../controller/bid.controller.js';

const router = express.Router();

// Create a bid
router.post('/', verifyToken, createBid);

// List bids for a gig (owner only)
router.get('/gig/:id', verifyToken, listBidsForGig);

// Count bids for a gig (public)
router.get('/gig/:id/count', countBidsForGig);

// Approve a bid (owner only)
router.post('/approve/:bidId', verifyToken, approveBid);

// Complete gig from approved bid (owner only)
router.post('/complete/:bidId', verifyToken, completeGigFromApprovedBid);

// Current user's bids on a gig
router.get('/my/gig/:id', verifyToken, getMyBidsForGig);

// Owner dashboard: list pending bids across owned gigs
router.get('/owner/pending', verifyToken, listPendingBidsForOwner);

// Owner dashboard: list completed bids
router.get('/owner/completed', verifyToken, listCompletedBidsForOwner);

// Bidder dashboard: list my bids
router.get('/me', verifyToken, listMyBids);

export default router;


