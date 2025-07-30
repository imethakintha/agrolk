import express from 'express';
import { protect } from '../middlewares/auth.js';
import User from '../models/User.js';
import upload from '../config/cloudinary.js';

const router = express.Router();

// @desc  Get my profile
// @route GET /api/profile/me
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

// @desc  Update profile (and upload image)
// @route PUT /api/profile
router.put(
  '/',
  protect,
  upload.single('image'),
  async (req, res) => {
    try {
      const updates = req.body;
      if (req.file) updates.image = req.file.path;

      // availability calendar (array of YYYY-MM-DD strings)
      if (updates.blockedDates) {
        updates.blockedDates = JSON.parse(updates.blockedDates);
      }

      const user = await User.findByIdAndUpdate(
        req.user.id,
        updates,
        { new: true, runValidators: true }
      );
      res.json(user);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

export default router;