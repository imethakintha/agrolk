import express from 'express';
import Stripe from 'stripe';
import Booking from '../models/Booking.js';
import Farm from '../models/Farm.js';
import User from '../models/User.js';
import { protect } from '../middlewares/auth.js';
import { sendEmail } from '../utils/email.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/', protect, async (req, res) => {
  try {
    const { farmId, activityId, date, guideId, driverId, participants = 1 } = req.body;
    const farm = await Farm.findById(farmId).populate('farmer');
    if (!farm) return res.status(404).json({ message: 'Farm not found' });

    const activity = farm.activities.id(activityId);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });
    if (participants > activity.capacity)
      return res.status(400).json({ message: 'Exceeds capacity' });

    const farmer = farm.farmer;
    if (farmer.blockedDates.includes(date))
      return res.status(400).json({ message: 'Farmer unavailable on this date' });

    let totalCost = activity.price * participants;
    if (guideId) {
      const guide = await User.findById(guideId);
      if (!guide) return res.status(404).json({ message: 'Guide not found' });
      totalCost += guide.serviceFee || 2000; 
    }
    if (driverId) {
      const driver = await User.findById(driverId);
      if (!driver) return res.status(404).json({ message: 'Driver not found' });
      totalCost += driver.serviceFee || 1500;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCost * 100,
      currency: 'lkr',
      metadata: { farmId, touristId: req.user.id },
    });

    const booking = await Booking.create({
      tourist: req.user.id,
      farm: farmId,
      activity: { id: activityId, ...activity.toObject() },
      guide: guideId || undefined,
      driver: driverId || undefined,
      date,
      totalCost,
      paymentIntentId: paymentIntent.id,
      participants,
    });

    await sendEmail({
      to: req.user.email,
      subject: 'Booking Confirmation – AgroLK',
      text: `Your booking at ${farm.name} on ${date} is pending payment.`,
    });
    await sendEmail({
      to: farmer.email,
      subject: 'New Booking Request',
      text: `A tourist booked ${activity.name} on ${date}. Check your dashboard.`,
    });

    res.status(201).json({ booking, clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/:id/confirm', protect, async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  if (booking.tourist.toString() !== req.user.id && req.user.role !== 'Admin')
    return res.status(403).json({ message: 'Not authorized' });

  booking.status = 'confirmed';
  await booking.save();
  res.json(booking);
});

router.get('/', protect, async (req, res) => {
  const filter = req.user.role === 'Farmer'
    ? { farm: { $in: await Farm.find({ farmer: req.user.id }).distinct('_id') } }
    : { tourist: req.user.id };
  const bookings = await Booking.find(filter)
    .populate('farm', 'name')
    .populate('guide driver', 'name email')
    .sort('-createdAt');
  res.json(bookings);
});

export default router;