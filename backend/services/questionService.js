// services/questionService.js
import Question from '../models/Question.model.js';

// export const createQuestion = async (data) => {
//     return await Question.create(data);
// };


export const createQuestion = async ({ category, content, correctAnswer, points, type, mediaFile, answerMediaFile }) => {
    if (!content && !mediaFile) {
      throw new Error("Either 'content' or 'media' is required.");
    }
  
    if (!correctAnswer && !answerMediaFile) {
      throw new Error("Either 'correctAnswer' or 'answerMedia' is required.");
    }
  
    const question = new Question({
      category,
      content,
      correctAnswer,
      points,
      type,
      mediaUrl: mediaFile ? mediaFile.path : null, 
    answerMediaUrl: answerMediaFile ? answerMediaFile.path : null,

    });
  
    return await question.save();
  };

// export const getAllQuestions = async () => {
//     return await Question.find();
// };

export const getAllQuestions = async () => {
    const questions = await Question.find().populate({
      path: "category",
      populate: { path: "parentCategory", select: "name" }, // Populate parentCategory and get only name
    });
  
    return questions.map((q) => ({
      _id: q._id,
      category: q.category,
      content: q.content,
      correctAnswer: q.correctAnswer,
      points: q.points,
      type: q.type,
      mediaUrl: q.mediaUrl ? q.mediaUrl : null,
      answerMediaUrl: q.answerMediaUrl ? q.answerMediaUrl : null,
    }));
  };

export const getQuestionById = async (id) => {
    return await Question.findById(id);
};


export const getQuestionMedia = async (id) => {
    const question = await Question.findById(id);
    if (!question || !question.media || !question.media.data) {
      throw new Error("Media not found.");
    }
    return question.media;
  };

 export const getAnswerMedia = async (id) => {
    const question = await Question.findById(id);
    if (!question || !question.answerMedia || !question.answerMedia.data) {
      throw new Error("Answer media not found.");
    }
    return question.answerMedia;
  };


// export const updateQuestion = async (id, data) => {
//     return await Question.findByIdAndUpdate(id, data, { new: true });
// };

export const updateQuestion = async ({ id, category, content, correctAnswer, points, type, mediaFile, answerMediaFile }) => {
    const question = await Question.findById(id);
    if (!question) {
      throw new Error("Question not found.");
    }
  
    // Update text fields only if they are provided
    if (category) question.category = category;
    if (content) question.content = content;
    if (correctAnswer) question.correctAnswer = correctAnswer;
    if (points) question.points = points;
    if (type) question.type = type;
  
    // Update media if new media file is provided
    if (mediaFile) {
      question.mediaUrl =mediaFile.path
    }
  
    // Update answer media if new answer media file is provided
    if (answerMediaFile) {
      question.answerMediaUrl =answerMediaFile.path
    }
  
    return await question.save();
  };
  

export const deleteQuestion = async (id) => {
    return await Question.findByIdAndDelete(id);
};
