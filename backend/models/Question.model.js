// models/Question.js
import mongoose from 'mongoose';
import Category from './Category.model.js';
// const questionSchema = mongoose.Schema({
//   category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
//   content: { type: String, required: true },
//   correctAnswer: { type: String, required: true },
//   points: { type: Number, default: 10 },
//   mediaUrl: { type: String },  // URL to media if any
// });

// 

const questionSchema = mongoose.Schema(
  {
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    content: { type: String }, // Text question (optional)
    correctAnswer: { type: String }, // Text answer (optional)
    points: { type: Number, default: 10 },
    mediaUrl: { type: String, default: null }, // Store media URL (image/video/audio)
    answerMediaUrl: { type: String, default: null }, // Store answer media URL
    type: {
      type: String,
      enum: ["text", "image", "video", "audio"],
      required: true,
    },
  },
  { timestamps: true }
);


// Pre-save hook to validate category reference
questionSchema.pre('save', async function (next) {
  if (this.category) {
      const categoryExists = await Category.findById(this.category);
      if (!categoryExists) {
          throw new Error('Category not found with id: ' + this.category);
      }
  }
  next();
});

export default mongoose.model('Question', questionSchema);
