import express from 'express';
import { verifyToken } from '../middelware/jwt.js';
import { createUserReview, listUserReviewsForUser } from '../controller/userReview.controller.js';

const router = express.Router();

router.post('/', verifyToken, createUserReview);
router.get('/:userId', listUserReviewsForUser);

export default router;


