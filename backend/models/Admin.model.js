import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const AdminSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'superadmin'], required: true },
  },
  { timestamps: true }
);

AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Pre-update hook for hashing password before updating an existing admin
AdminSchema.pre('findOneAndUpdate', async function(next) {
    const password = this.getUpdate().$set.password;
    if (!password) {
      return next();
    }
  
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      this.getUpdate().$set.password = hash;
    } catch (error) {
      return next(error);
    }
    next();
  });


AdminSchema.methods.generateJWT = function () {
  return jwt.sign({ id: this._id, email: this.email, role: this.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export default mongoose.model('Admin', AdminSchema);
