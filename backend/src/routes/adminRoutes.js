import express from 'express';
import User from '../models/User.js';
import Farm from '../models/Farm.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import { adminOnly } from '../middlewares/admin.js';

const router = express.Router();
router.use(adminOnly);

router.get('/users', async (req, res) => {
  const { role, status } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (status) {
    if (status === 'pending') filter.isVerified = false;
    else if (status === 'verified') filter.isVerified = true;
  }
  const users = await User.find(filter).select('-password');
  res.json(users);
});

router.patch('/users/:id/verify', async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isVerified: true },
    { new: true }
  );
  res.json({ message: `${user.role} verified`, user });
});

router.patch('/users/:id/suspend', async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: 'User suspended' });
});

router.patch('/users/:id/restore', async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isActive: true });
  res.json({ message: 'User restored' });
});

router.patch('/farms/:id/visibility', async (req, res) => {
  const { isActive } = req.body;
  await Farm.findByIdAndUpdate(req.params.id, { isActive });
  res.json({ message: `Farm visibility set to ${isActive}` });
});

router.delete('/reviews/:id', async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ message: 'Review deleted' });
});

router.get('/analytics', async (_req, res) => {
  const [
    totalUsers,
    totalFarms,
    totalBookings,
    totalRevenue,
    pendingVerifications,
  ] = await Promise.all([
    User.countDocuments(),
    Farm.countDocuments(),
    Booking.countDocuments({ status: 'confirmed' }),
    Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, revenue: { $sum: '$totalCost' } } },
    ]).then(r => r[0]?.revenue || 0),
    User.countDocuments({ role: { $in: ['Guide', 'Driver'] }, isVerified: false }),
  ]);

  res.json({
    totalUsers,
    totalFarms,
    totalBookings,
    totalRevenue,
    pendingVerifications,
  });
});

export default router;