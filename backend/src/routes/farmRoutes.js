import express from 'express';
import { protect, restrictTo } from '../middlewares/auth.js';
import Farm from '../models/Farm.js';
import upload from '../config/cloudinary.js';

const router = express.Router();

router.post(
  '/',
  protect,
  restrictTo('Farmer'),
  upload.array('images', 5),
  async (req, res) => {
    try {
      const data = JSON.parse(req.body.data); 
      const images = req.files?.map(f => f.path) || [];
      const farm = await Farm.create({ ...data, farmer: req.user.id, images });
      res.status(201).json(farm);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

router.get('/', async (_req, res) => {
  const farms = await Farm.find({ isActive: true }).populate('farmer', 'name email');
  res.json(farms);
});

router.get('/:slug', async (req, res) => {
  const farm = await Farm.findOne({ slug: req.params.slug }).populate('farmer', 'name email');
  if (!farm) return res.status(404).json({ message: 'Farm not found' });
  res.json(farm);
});

router.put(
  '/:id',
  protect,
  upload.array('images', 5),
  async (req, res) => {
    try {
      const farm = await Farm.findById(req.params.id);
      if (!farm) return res.status(404).json({ message: 'Farm not found' });
      if (farm.farmer.toString() !== req.user.id && req.user.role !== 'Admin')
        return res.status(403).json({ message: 'Not authorized' });

      const data = JSON.parse(req.body.data || '{}');
      if (req.files) data.images = [...farm.images, ...req.files.map(f => f.path)];

      const updated = await Farm.findByIdAndUpdate(req.params.id, data, { new: true });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

router.delete('/:id', protect, restrictTo('Farmer', 'Admin'), async (req, res) => {
  const farm = await Farm.findById(req.params.id);
  if (!farm) return res.status(404).json({ message: 'Farm not found' });
  if (farm.farmer.toString() !== req.user.id && req.user.role !== 'Admin')
    return res.status(403).json({ message: 'Not authorized' });

  await farm.deleteOne();
  res.json({ message: 'Farm removed' });
});

export default router;