import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    //fullName: { type: String, required: true },
    firstName:{ type: String, required: true},
    lastName:{ type: String, required: true},
    mobileNumber:{ type: String, required: true},
    dob:{type:Date, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    subscription: { type: String, enum: ['standard', 'premium','user'], default: 'user' },
    blocked: { type: Boolean, default: false },
    profilePicture: { type: String, default: null }
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


UserSchema.pre('findOneAndUpdate', async function(next) {
  if (this._update.password) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this._update.password, salt);
      this._update.password = hash; // Ensuring the update directly modifies the document
  }
  next();
});




UserSchema.methods.generateJWT = function () {
  return jwt.sign({ id: this._id, email: this.email, subscription: this.subscription }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export default mongoose.model('User', UserSchema);
