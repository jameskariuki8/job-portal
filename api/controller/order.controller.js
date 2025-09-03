import createError from '../utils/createError.js'
import Order from '../models/order.model.js'
import Gig from '../models/gig.model.js'
import Stripe from 'stripe';
export const intent = async (req, res, next) => {
  try {
    if (!process.env.STRIPE) {
      return res.status(503).send('Payments are temporarily disabled');
    }

    const stripe = new Stripe(process.env.STRIPE);

    const gig = await Gig.findById(req.params.id);

    // Check if gig is available
    if (gig.status !== 'available') {
      return res.status(400).send('This gig is not available for bidding');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: gig.priceMin * 100,
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    const newOrder = new Order({
      gigId: gig._id,
      img: gig.cover,
      title: gig.title,
      buyerId: req.userId,
      sellerId: gig.userId,
      price: gig.priceMin,
      payment_intent: paymentIntent.id,
      status: 'pending'
    });

    await newOrder.save();

    // Update gig status to in_progress
    await Gig.findByIdAndUpdate(gig._id, { status: 'in_progress' });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    next(err);
  }
}

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      ...(req.sellerId ? { sellerId: req.userId } : { buyerId: req.userId }),
    }).populate('gigId', 'title cover status');
    
    res.status(200).send(orders);
  } catch (err) {
    next(err)
  }
}
export const confirm = async (req, res, next) => {
  try {
    if (!process.env.STRIPE) {
      return res.status(503).send('Payments are temporarily disabled');
    }
    const order = await Order.findOneAndUpdate({
      payment_intent: req.body.payment_intent,
    },
    {
      $set: {
        status: 'completed',
      },},
    );
    
    // Update gig status to completed
    if (order) {
      await Gig.findByIdAndUpdate(order.gigId, { status: 'completed' });
    }
    
    res.status(200).send('Order has been completed');
  } catch (err) {
    next(err)
  }
}