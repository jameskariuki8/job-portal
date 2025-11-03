import express from 'express';
import { getOverview, listUsers, listGigs, adminDeleteUser, adminDeleteGig } from '../controller/admin.controller.js';

const router = express.Router();

// No auth per request: superadmin is open (security risk in production)
router.get('/overview', getOverview);
router.get('/users', listUsers);
router.get('/gigs', listGigs);
router.delete('/users/:id', adminDeleteUser);
router.delete('/gigs/:id', adminDeleteGig);

export default router;


