// models/TrialGame.js
import mongoose from "mongoose";

const trialGameSchema = new mongoose.Schema({
  // Reference the user who’s doing the trial
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  // Either store multiple categories or a single category, depending on your design
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },

  // Array of questions for the trial
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],

  // We might not need multiple rounds if it’s just a quick practice,
  // but you can keep them if you want to replicate the real game structure:
  rounds: { type: Number, default: 1 },
  currentRound: { type: Number, default: 1 },

  // Track used questions in the trial
  usedQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],

  // Which question is currently being shown
  currentQuestionIndex: { type: Number, default: 0 },

  // Score or other fields if you want
  score: { type: Number, default: 0 },

  // Standard timestamps
  status: {
    type: String,
    enum: ["active", "completed"],
    default: "active",
  },
}, { timestamps: true });

export const TrialGame = mongoose.model("TrialGame", trialGameSchema);
