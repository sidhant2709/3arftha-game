import mongoose from "mongoose";
import { TrialGame } from "../models/TrialGame.js";
import  Question  from "../models/Question.model.js";
import Category from "../models/Category.model.js";

export const startOrContinueTrial = async (userId, trialDetails) => {
  
  const firstSubcategoryId = new mongoose.Types.ObjectId(trialDetails.subcategories[0]);
  
    const firstSubcatDoc = await Category
    .findById(firstSubcategoryId)
    .populate('parentCategory');
  
  // 1) Check if there's an active trial for this user
    let trialGame = await TrialGame.findOne({ creator: userId, status: "active" })
      .populate("questions");
  
      
    // 2) If NO active trial, create one with a fixed set of 10 questions
    if (!trialGame) {
      // If you want a particular category each time, you could do:
      // const fixedCategoryId = "67a3139e3e227204e23f1d51";
      // but let's assume you might optionally pass it in trialDetails:
      const { categoryId } = trialDetails || {};
  
      // We'll demonstrate a scenario:
      // a) If categoryId is provided, we get the first 10 from that category.
      // b) If not, we get the first 10 from the entire questions collection.
  
      // Build query object
      const query = {};
      if (categoryId) {
        query.category = new mongoose.Types.ObjectId(categoryId);
      }
  
      // Sort by _id ascending so we always get the same 10
      const selectedQuestions = await Question.find(query)
        .sort({ _id: 1 })
        .limit(10);
  
      if (selectedQuestions.length<10)  {
        throw new Error(
          "Not enough questions in the database to start the trial game!"
        );
      }
  
      // Create new TrialGame doc
      trialGame = new TrialGame({
        creator: userId,
        // If we want to store the single category, do so:
        category: categoryId || null, 
        questions: selectedQuestions.map((q) => q._id),
        usedQuestions: selectedQuestions.map((q) => q._id),
        rounds: 1,
        currentRound: 1,
        currentQuestionIndex: 0,
        status: "active",
      });
  
      await trialGame.save();
  
      // Return the first question
      return {
        message: "Trial game started",
        parentCategory: firstSubcatDoc.parentCategory.name,
        trialGameId: trialGame._id,
        currentQuestionIndex: 1, // 1-based index
        // You can return the entire question doc if you want:
        question: selectedQuestions[0],
        teams:trialDetails.teams || [],
      };
    }
  
    // 3) If an active trial exists, serve the next question or end if done
    if (trialGame.currentQuestionIndex >= trialGame.questions.length-1) {
      trialGame.status = "completed";
      await trialGame.save();
      return { message: "Trial game completed. No more questions available." };
    }
  
    // Next question ID in the array
    const nextQuestionDoc = trialGame.questions[trialGame.currentQuestionIndex];
    trialGame.currentQuestionIndex += 1;
    await trialGame.save();
  
    return {
      message: "Next trial question",
      parentCategory: firstSubcatDoc.parentCategory.name,
      trialGameId: trialGame._id,
      currentQuestionIndex: trialGame.currentQuestionIndex+1, // or +1 for front-end
      question: nextQuestionDoc,
      teams:trialDetails.teams || []
    };
  };