import mongoose from 'mongoose';


const bookingSchema = new mongoose.Schema(
  {
    tourist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    activity: {
      id: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: String,
      price: Number,
      duration: Number,
      capacity: Number,
    },
    guide: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, required: true },
    totalCost: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    paymentIntentId: String, // from Stripe
    participants: { type: Number, default: 1 },
  },
  { timestamps: true }
);

bookingSchema.index({ farm: 1, date: 1 });
export default mongoose.model('Booking', bookingSchema);