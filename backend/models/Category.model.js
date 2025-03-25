// import mongoose from 'mongoose';

// const categorySchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String },
//   parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
//   categoryPicture: { type: String, default: null } // self-reference to allow subcategories
// });

// export default mongoose.model('Category', categorySchema);

import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null }, // Self-referencing parent category
  categoryPicture: { type: String, default: null }, // Store Cloudinary URL
});


categorySchema.pre("save", async function (next) {
  if (this.parentCategory) {
    const parent = await mongoose.model("Category").findById(this.parentCategory);
    if (!parent) {
      return next(new Error("Invalid parent category."));
    }
  }
  next();
});

export default mongoose.model("Category", categorySchema);
