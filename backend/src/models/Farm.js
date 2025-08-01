import mongoose from 'mongoose';
import slugify from 'slugify';

const ActivitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true }, 
  price: { type: Number, required: true },
  capacity: { type: Number, required: true },
});

const farmSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number], 
        required: true,
      },
    },
    images: [{ type: String }], 
    activities: [ActivitySchema],
    isActive: { type: Boolean, default: true },
    averageRating: { type: Number, default: 0 },
    reviewCount:   { type: Number, default: 0 },
  },
  { timestamps: true }
);

farmSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

farmSchema.index({ location: '2dsphere' });

farmSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Farm', farmSchema);