import Category from '../models/Category.model.js';

// export const createCategory = async (data) => {
//   return await Category.create(data);
// };

export const createCategory = async (data, categoryPictureFile) => {
  // Validate parent category if provided
  if (data.parentCategory) {
    const parentCategory = await Category.findById(data.parentCategory);
    if (!parentCategory) {
      throw new Error("Invalid parent category.");
    }
  }

  // Upload category picture to Cloudinary if provided
  let categoryPictureUrl = null;
  if (categoryPictureFile) {
    categoryPictureUrl = categoryPictureFile.path; // Cloudinary returns a URL
  }

  const category = new Category({
    ...data,
    categoryPicture: categoryPictureUrl,
  });

  return await category.save();
};

export const getAllCategories = async () => {
  return await Category.find().populate('parentCategory');
};

export const getCategoryById = async (id) => {
  return await Category.findById(id).populate('parentCategory');
};

// export const updateCategory = async (id, data) => {
//   return await Category.findByIdAndUpdate(id, data, { new: true });
// };


export const updateCategory = async (id, data, categoryPictureFile) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new Error("Category not found.");
  }

  // Validate parent category if updated
  if (data.parentCategory) {
    const parentCategory = await Category.findById(data.parentCategory);
    if (!parentCategory) {
      throw new Error("Invalid parent category.");
    }
  }

  // Update fields only if provided
  if (data.name) category.name = data.name;
  if (data.description) category.description = data.description;
  if (data.parentCategory) category.parentCategory = data.parentCategory;

  // Update category image if a new image is uploaded
  if (categoryPictureFile) {
    category.categoryPicture = categoryPictureFile.path;
  }

  return await category.save();
};


export const deleteCategory = async (id) => {
  return await Category.findByIdAndDelete(id);
};



export const getAllCategoriesForApi=async ()=> {
  return await Category.find({ parentCategory: null }); 
}

export const getAllSubCategoriesForApi=async ()=> {
  return await Category.find({ parentCategory: { $ne: null } }).populate("parentCategory"); 
}
