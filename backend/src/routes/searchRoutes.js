import express from 'express';
import Farm from '../models/Farm.js';

const router = express.Router();

// @desc  Search & filter farms
// @route GET /api/search
router.get('/', async (req, res) => {
  try {
    const {
      q,          // text
      lat,
      lng,
      radius = 25, // km
      minPrice,
      maxPrice,
      activityType,
      date,       // YYYY-MM-DD
      page = 1,
      limit = 12,
    } = req.query;

    const pipeline = [];

    // Text search
    if (q) pipeline.push({ $match: { $text: { $search: q } } });

    // Geo filter
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

    // Price filter (cheapest activity in farm)
    if (minPrice || maxPrice) {
      const priceMatch = {};
      if (minPrice) priceMatch.$gte = Number(minPrice);
      if (maxPrice) priceMatch.$lte = Number(maxPrice);
      pipeline.push({ $match: { 'activities.price': priceMatch } });
    }

    // Activity name filter
    if (activityType) {
      pipeline.push({
        $match: { 'activities.name': new RegExp(activityType, 'i') },
      });
    }

    // Date availability (blockedDates on farmer NOT containing date)
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

    // Pagination facets
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
                images: { $slice: ['$images', 1] }, // first image as thumbnail
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