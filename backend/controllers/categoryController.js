import * as categoryService from '../services/categoryService.js';

// export const createCategory = async (req, res) => {
//   try {
//     const category = await categoryService.createCategory(req.body);
//     res.status(201).json(category);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

export const createCategory = async (req, res) => {
  try {
    const categoryPictureFile = req.file ? req.file : null;

    const category = await categoryService.createCategory(req.body, categoryPictureFile);

    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategory = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    res.json(category);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// export const updateCategory = async (req, res) => {
//   try {
//     const category = await categoryService.updateCategory(req.params.id, req.body);
//     res.json(category);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

export const updateCategory = async (req, res) => {
  try {
    const categoryPictureFile = req.file ? req.file : null;

    const updatedCategory = await categoryService.updateCategory(req.params.id, req.body, categoryPictureFile);

    res.json({ message: "Category updated successfully", category: updatedCategory });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
