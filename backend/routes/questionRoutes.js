// routes/questionRoutes.js
import express from 'express';
import { createQuestion, getQuestions, getQuestionById, updateQuestion, deleteQuestion, uploadMedia,getQuestionMedia, getAnswerMedia } from '../controllers/questionController.js';
import upload from '../utils/multerConfig.js';
import { uploadQuestionMedia } from '../config/cloudinaryConfig.js';
// import multer from 'multer';  // For media uploads
// import {uploadMedia1}  from '../controllers/mediaController.js'
const router = express.Router();
// const upload = multer({ dest: 'uploads/' });  // Configure as needed

router.post('/',uploadQuestionMedia.fields([{ name: "media" }, { name: "answerMedia" }]), createQuestion);
router.get('/', getQuestions);
router.get('/:id', getQuestionById);
router.get("/:id/media", getQuestionMedia);
router.get("/:id/answer-media", getAnswerMedia);
router.put('/:id',uploadQuestionMedia.fields([{ name: "media" }, { name: "answerMedia" }]), updateQuestion);
router.delete('/:id', deleteQuestion);
router.post('/upload-media', uploadMedia);



export default router;
