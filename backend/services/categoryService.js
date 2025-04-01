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
  const category = await Category.findById(id).populate("parentCategory");

  if (!category) {
    throw new Error("Category not found");
  }

  // If the category has a parent, do not fetch subcategories
  if (category.parentCategory) {
    return {
      _id: category._id,
      name: category.name,
      description: category.description,
      parentCategory: {
        _id: category.parentCategory._id,
        name: category.parentCategory.name
      }
    };
  }

  // Fetch subcategories only if the category is a parent category
  const subcategories = await Category.find({ parentCategory: id }).select("_id name");

  return {
    _id: category._id,
    name: category.name,
    description: category.description,
    subcategories: subcategories.length ? subcategories : []
  };
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
