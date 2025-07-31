import express from 'express';
import User from '../models/User.js';
import { signToken } from '../utils/jwt.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, ...rest } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already exists' });

    const user = await User.create({ name, email, password, role, ...rest });
    const token = signToken({ id: user._id });
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken({ id: user._id });
    res.json({ token, user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/me', protect, (req, res) => res.json(req.user));

export default router;