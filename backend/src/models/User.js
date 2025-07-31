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
    image: { type: String },              
    blockedDates: [{ type: String }],
    licenseNo: { type: String },               
    languages: [{ type: String }],              
    vehicleType: { type: String },              
    vehicleNumber: { type: String },            
    serviceAreas: [{ type: String }],           
    averageRating: { type: Number, default: 0 },
    reviewCount:   { type: Number, default: 0 },

    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);