// // models/Game.js
// import mongoose from 'mongoose';

// const gameSchema = mongoose.Schema({
//   creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
//   questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
//   teams: [{
//     name: String,
//     members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
//   }],
//   results: [{
//     team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
//     score: Number,
//     answers: [String]
//   }],
//   status: { type: String, enum: ['pending', 'active', 'completed'], default: 'pending' }
// });

// export default mongoose.model('Game', gameSchema);



// models/Game.js
import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  participantCount: { type: Number, required: true, min: 1 },  // Number of participants per team
  score: { type: Number, default: 0 }  // Score for each team
});

const gameSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', optional: true },  // Creator could be optional
  category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  teams: [teamSchema],
  status: { type: String, enum: ['pending', 'active', 'completed'], default: 'pending' },
  rounds: { type: Number, required: true, default: 3 },//new.
  currentRound: { type: Number, default: 1 },//new
  usedQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],//new
  currentQuestionIndex: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Game', gameSchema);
