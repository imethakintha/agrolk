import Review from '../models/Review.js';

export async function recalcAverage(targetType, targetId) {
  const agg = await Review.aggregate([
    { $match: { targetType, targetId } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  const { avgRating = 0, count = 0 } = agg[0] || {};
  const Model = { Farm: (await import('./Farm.js')).default,
                  Guide: (await import('./User.js')).default,
                  Driver: (await import('./User.js')).default }[targetType];
  await Model.findByIdAndUpdate(targetId, {
    averageRating: Number(avgRating.toFixed(2)),
    reviewCount: count,
  });
}