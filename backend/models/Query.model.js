import mongoose from 'mongoose';
import User from './User.model.js';

const statusEnum = ['open', 'in progress', 'closed'];

const querySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'open', enum: ['open', 'in progress', 'closed'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});


querySchema.pre('findOneAndUpdate', function(next) {
    const update = this.getUpdate();
    
    // Check if the status is being updated
    if (update.status && !statusEnum.includes(update.status)) {
      next(new Error(`Invalid status '${update.status}'. Status must be one of ${statusEnum.join(", ")}.`));
    } else {
      // Set the updatedAt to current date/time
      update.updatedAt = new Date();
      next();
    }
  });



querySchema.pre('save', async function (next) {
  if (this.user) {
      const userExists = await User.findById(this.user);
      if (!userExists) {
          throw new Error('User not found with id: ' + this.user);
      }
  }
  next();
});


export default mongoose.model('Query', querySchema);