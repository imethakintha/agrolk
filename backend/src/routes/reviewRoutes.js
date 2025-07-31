import express from 'express';
import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import { protect } from '../middlewares/auth.js';
import { recalcAverage } from '../utils/ratingHelpers.js';

const router = express.Router();

// @desc  Create review (after booking completed)
// @route POST /api/reviews
router.post('/', protect, async (req, res) => {
  try {
    const { bookingId, targetType, targetId, rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.tourist.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not your booking' });
    if (booking.status !== 'completed')
      return res.status(400).json({ message: 'Cannot review before completion' });

    // Prevent duplicate
    const exists = await Review.findOne({ booking: bookingId, targetType });
    if (exists)
      return res.status(400).json({ message: 'Review already submitted' });

    const review = await Review.create({
      booking: bookingId,
      author: req.user.id,
      targetType,
      targetId,
      rating,
      comment,
    });

    await recalcAverage(targetType, targetId);
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @desc  Get reviews for a target
// @route GET /api/reviews/:targetType/:targetId
router.get('/:targetType/:targetId', async (req, res) => {
  const { targetType, targetId } = req.params;
  const reviews = await Review.find({ targetType, targetId })
    .populate('author', 'name')
    .sort('-createdAt');
  res.json(reviews);
});

// @desc  Reply to review (provider only)
// @route PATCH /api/reviews/:id/reply
router.patch('/:id/reply', protect, async (req, res) => {
  const { reply } = req.body;
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: 'Review not found' });

  // Ensure provider owns the target
  const targetModel = { Farm: (await import('./Farm.js')).default,
                        Guide: (await import('./User.js')).default,
                        Driver: (await import('./User.js')).default }[review.targetType];

  const target = await targetModel.findById(review.targetId);
  const ownerId = review.targetType === 'Farm' ? target.farmer : target._id;
  if (ownerId.toString() !== req.user.id)
    return res.status(403).json({ message: 'Not authorized' });

  review.reply = reply;
  await review.save();
  res.json(review);
});

export default router;