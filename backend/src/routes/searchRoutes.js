import express from 'express';
import Farm from '../models/Farm.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const {
      q,       
      lat,
      lng,
      radius = 25, 
      minPrice,
      maxPrice,
      activityType,
      date,
      page = 1,
      limit = 12,
    } = req.query;

    const pipeline = [];

    if (q) pipeline.push({ $match: { $text: { $search: q } } });

    if (lat && lng) {
      pipeline.push({
        $geoNear: {
          near: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          distanceField: 'distance',
          maxDistance: parseFloat(radius) * 1000, // km → m
          spherical: true,
        },
      });
    }

    if (minPrice || maxPrice) {
      const priceMatch = {};
      if (minPrice) priceMatch.$gte = Number(minPrice);
      if (maxPrice) priceMatch.$lte = Number(maxPrice);
      pipeline.push({ $match: { 'activities.price': priceMatch } });
    }

    if (activityType) {
      pipeline.push({
        $match: { 'activities.name': new RegExp(activityType, 'i') },
      });
    }

    if (date) {
      pipeline.push(
        { $lookup: {
            from: 'users',
            localField: 'farmer',
            foreignField: '_id',
            as: 'farmerInfo'
        }},
        { $unwind: '$farmerInfo' },
        { $match: { 'farmerInfo.blockedDates': { $ne: date } } }
      );
    }

    pipeline.push(
      {
        $facet: {
          meta: [{ $count: 'total' }],
          data: [
            { $skip: (page - 1) * limit },
            { $limit: Number(limit) },
            {
              $project: {
                name: 1,
                slug: 1,
                images: { $slice: ['$images', 1] },
                activities: 1,
                distance: { $ifNull: ['$distance', 0] },
              },
            },
          ],
        },
      }
    );

    const [result] = await Farm.aggregate(pipeline);
    const { meta, data } = result;
    res.json({ total: meta[0]?.total || 0, farms: data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;