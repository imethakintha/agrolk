import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ['Tourist', 'Farmer', 'Guide', 'Driver', 'Admin'],
      default: 'Tourist',
    },
    image: { type: String },              // profile / cover photo
    blockedDates: [{ type: String }],     // ISO date strings
    // role-specific fields
    licenseNo: { type: String },                // Guide
    languages: [{ type: String }],              // Guide
    vehicleType: { type: String },              // Driver
    vehicleNumber: { type: String },            // Driver
    serviceAreas: [{ type: String }],           // Guide & Driver
    averageRating: { type: Number, default: 0 },
    reviewCount:   { type: Number, default: 0 },

    isVerified: { type: Boolean, default: false },
     // Admin approval (Guide/Driver)
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password instance method
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);