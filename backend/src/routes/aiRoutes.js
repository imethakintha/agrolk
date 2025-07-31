import express from 'express';
import upload from '../config/cloudinary.js';
import { identifyImage } from '../utils/aiService.js';

const router = express.Router();

// @desc  Identify plant / fruit / etc.
// @route POST /api/ai/identify
router.post(
  '/identify',
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: 'Image required' });
      const result = await identifyImage(req.file.path);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'AI service failed' });
    }
  }
);

export default router;