// controllers/questionController.js
import * as questionService from '../services/questionService.js';

export const createQuestion = async (req, res) => {
    // try {
    //     const question = await questionService.createQuestion(req.body);
    //     res.status(201).json(question);
    // } catch (error) {
    //     res.status(500).json({ message: error.message });
    // }

    try {
        const { category, content, correctAnswer, points, type } = req.body;
        const mediaFile = req.files["media"] ? req.files["media"][0] : null;
        const answerMediaFile = req.files["answerMedia"] ? req.files["answerMedia"][0] : null;
    
        const question = await questionService.createQuestion({
          category,
          content,
          correctAnswer,
          points,
          type,
          mediaFile,
          answerMediaFile,
        });
    
        res.status(201).json({ message: "Question created successfully", questionId: question._id });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
}

export const getQuestions = async (req, res) => {
    try {
        const questions = await questionService.getAllQuestions();
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getQuestionById = async (req, res) => {
    try {
        const question = await questionService.getQuestionById(req.params.id);
        res.json(question);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// export const updateQuestion = async (req, res) => {
//     try {
//         const updatedQuestion = await questionService.updateQuestion(req.params.id, req.body);
//         res.json(updatedQuestion);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


export const updateQuestion = async (req, res) => {
    try {
      const { category, content, correctAnswer, points, type } = req.body;
      const mediaFile = req.files["media"] ? req.files["media"][0] : null;
      const answerMediaFile = req.files["answerMedia"] ? req.files["answerMedia"][0] : null;
  
      const updatedQuestion = await questionService.updateQuestion({
        id: req.params.id,
        category,
        content,
        correctAnswer,
        points,
        type,
        mediaFile,
        answerMediaFile,
      });
  
      res.status(200).json({ message: "Question updated successfully", questionId: updatedQuestion._id });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

export const deleteQuestion = async (req, res) => {
    try {
        await questionService.deleteQuestion(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// export const uploadMedia = async (req, res) => {
//     try {
//         // Assuming the media URL will be saved in the database or returned to the client
//         const mediaUrl = `/uploads/${req.file.filename}`;
//         res.json({ mediaUrl });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };



export const uploadMedia = async (req, res) => {
    try {
        if (req.file) {
            res.status(200).json({
                message: "File uploaded successfully",
                filename: req.file.filename, // Or any other detail you want to return
            });
        } else {
            res.status(400).json({
                message: "No file uploaded"
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getQuestionMedia = async (req, res) => {
    try {
      const media = await questionService.getQuestionMedia(req.params.id);
      res.set("Content-Type", media.contentType);
      res.send(media.data);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };


export const getAnswerMedia = async (req, res) => {
    try {
      const media = await questionService.getAnswerMedia(req.params.id);
      res.set("Content-Type", media.contentType);
      res.send(media.data);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };