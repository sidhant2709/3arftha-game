import express from 'express';
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { uploadCategoryImage } from '../config/cloudinaryConfig.js';

const router = express.Router();

router.post('/',uploadCategoryImage.single("categoryPicture"), createCategory);
router.get('/', getCategories);
router.get('/:id', getCategory);
router.put('/:id',  uploadCategoryImage.single("categoryPicture"),updateCategory);
router.delete('/:id', deleteCategory);

export default router;
