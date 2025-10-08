import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from './routes/user.route.js';
import gigRoute from './routes/gig.route.js';
import reviewRoute from './routes/review.route.js';
import orderRoute from './routes/order.route.js';
import conversationRoute from './routes/conversation.route.js';
import messageRoute from './routes/message.route.js';
import authRoute from './routes/auth.route.js';
import bidRoute from './routes/bid.route.js';
import userReviewRoute from './routes/userReview.route.js';
import cookieParser from "cookie-parser";
import cors from 'cors';

const app = express();
dotenv.config();
mongoose.set('strictQuery', true);
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('database connected');
  } catch (error) {
    console.log(error);
  }
};
//middleware
//frontend port number
app.use(cors({
  origin: (origin, callback) => {
    try {
      const allowedOrigins = [
        'http://localhost:3000',
        process.env.CLIENT_URL,
      ].filter(Boolean);

      // Allow same-origin or non-browser requests (no Origin header)
      if (!origin) return callback(null, true);

      // Allow exact match against configured client URL or localhost
      if (allowedOrigins.includes(origin)) return callback(null, true);

      // Allow any Vercel preview or production app domain
      const isVercel = /https?:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);
      if (isVercel) return callback(null, true);

      return callback(new Error('Not allowed by CORS'));
    } catch (e) {
      return callback(new Error('CORS validation failed'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth/', authRoute);
app.use('/api/users', userRoute);
app.use('/api/gigs', gigRoute);
app.use('/api/reviews', reviewRoute);
app.use('/api/orders', orderRoute);
app.use('/api/conversations', conversationRoute);
app.use('/api/messages', messageRoute);
app.use('/api/bids', bidRoute);
app.use('/api/user-reviews', userReviewRoute);

// Track last connection error
let lastMongoError = null;
mongoose.connection.on('error', (err) => {
  lastMongoError = err;
});

// Lightweight health endpoint to validate env and DB connectivity in Vercel
app.get('/api/health', async (req, res) => {
  let pingOk = false;
  let pingError = null;
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO, { serverSelectionTimeoutMS: 5000 });
    }
    // If connected, try a ping
    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
      // @ts-ignore - admin exists at runtime
      await mongoose.connection.db.admin().ping();
      pingOk = true;
    }
  } catch (e) {
    pingError = e instanceof Error ? e.message : String(e);
  }
  res.status(200).json({
    ok: true,
    mongoConnected: mongoose.connection.readyState === 1,
    pingOk,
    lastMongoError: lastMongoError ? String(lastMongoError) : null,
    pingError,
    env: {
      JWT_KEY: Boolean(process.env.JWT_KEY),
      MONGO: Boolean(process.env.MONGO),
      CLIENT_URL: process.env.CLIENT_URL || null,
    }
  });
});


app.use((err, req, res, next) => {
  const errorStatus = err.status || 500
  const errorMessage = err.message || "Something went wrong"

  return res.status(errorStatus).send(errorMessage);
})

// Initialize DB connection once when the module is loaded (works for serverless cold starts)
connect();

export default app;