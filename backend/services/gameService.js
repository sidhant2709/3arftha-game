import Game from "../models/Game.model.js";
import Category from "../models/Category.model.js";
import Question from "../models/Question.model.js";
import mongoose from "mongoose";
// Start a new game session
// export const startNewGame = async (gameDetails) => {
//   // This should handle initializing a game, setting its initial state, and selecting questions if applicable.
//   // const selectedQuestions = await Question.find({ category: gameDetails.category }).limit(10); // Select 10 questions for the game.
//   if (!gameDetails.subcategories || !Array.isArray(gameDetails.subcategories) || gameDetails.subcategories.length === 0) {
//     throw new Error("At least one subcategory is required.");
//   }

//   const subcategoryIds = gameDetails.subcategories.map(id => new mongoose.Types.ObjectId(id));

//   const selectedQuestions = await Question.aggregate([
//     // { $match: { category: new mongoose.Types.ObjectId(gameDetails.category) } },
//     { $match: { category: { $in: subcategoryIds } } },
//     { $sample: { size: 10 } }
//   ]);

//   const game = new Game({
//     ...gameDetails,
//     questions: selectedQuestions.map(q => q._id),
//     status: 'active'
//   });
//   return await game.save();
// };

const getAssignedTeam = (game) => {
  const teamCount = game.teams.length;
  // Compute the global question index:
  // (currentRound - 1) * 10 (questions per round) + currentQuestionIndex
  const globalIndex = (game.currentRound - 1) * 10 + game.currentQuestionIndex;
  const assignedTeamIndex = globalIndex % teamCount;
  return game.teams[assignedTeamIndex];
};

export const startNewGame = async (userId, gameDetails) => {
  let game = await Game.findOne({ creator: userId, status: "active" }).populate(
    "questions"
  );

  const firstSubcategoryId = new mongoose.Types.ObjectId(gameDetails.subcategories[0]);

  const firstSubcatDoc = await Category
  .findById(firstSubcategoryId)
  .populate('parentCategory');

if (!firstSubcatDoc) {
  throw new Error("Invalid subcategory ID");
}


  if (!game) {
    // No active game found, start a new game
    if (
      !gameDetails.subcategories ||
      !Array.isArray(gameDetails.subcategories) ||
      gameDetails.subcategories.length === 0
    ) {
      throw new Error("At least one subcategory is required.");
    }

    const subcategoryIds = gameDetails.subcategories.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    // Fetch 10 unique random questions that the user has not seen yet
    const selectedQuestions = await Question.aggregate([
      { $match: { category: { $in: subcategoryIds }, _id: { $nin: [] } } }, // Initially empty `usedQuestions`
      { $sample: { size: 10 } },
    ]);
      console.log("selectedQuestions: ", selectedQuestions);
    if (selectedQuestions.length === 0) {
      throw new Error("No questions available for the selected subcategories.");
    }

    


    game = new Game({
      creator: userId,
      category: gameDetails.subcategories,
      questions: selectedQuestions.map((q) => q._id),
      teams: gameDetails.teams,
      rounds: gameDetails.rounds || 3, // Default to 3 rounds
      currentRound: 1,
      currentQuestionIndex: 0,
      usedQuestions: selectedQuestions.map((q) => q._id),
      status: "active",
    });

    await game.save();

    // const teamCount = game.teams.length;
    // const assignedTeamIndex = game.currentQuestionIndex % teamCount;
    // const assignedTeam = game.teams[assignedTeamIndex];
    const assignedTeam = getAssignedTeam(game);

    return {
      message: "New game started",
      parentCategory:firstSubcatDoc.parentCategory.name,
      gameId: game._id,
      currentRound: game.currentRound,
      currentQuestionIndex: game.currentQuestionIndex + 1,
      question: selectedQuestions[0],
      teams: game.teams,
      assignedTeam
    };
  }

  // Check if all questions in the current round are used
  if (game.currentQuestionIndex >= game.questions.length-1) {
    // Check if more rounds exist
    if (game.currentRound < game.rounds) {
     

      // Fetch 10 new questions excluding previously used ones
      const newQuestions = await Question.aggregate([
        {
          $match: {
            category:{ $in: game.category },
            _id: { $nin: game.usedQuestions },
          },
        },
        { $sample: { size: 10 } },
      ]);
      console.log("newQuestions: ", newQuestions);

      if (newQuestions.length === 0) {
        game.status = "active";
        await game.save();
        return { message: `No more questions available For User ${game.creator}  as all questions used for subcategory ${gameDetails.subcategories}` };
      }
      game.currentRound += 1; // Move to next round
      game.questions = newQuestions.map((q) => q._id);
      game.usedQuestions.push(...newQuestions.map((q) => q._id)); // Keep track of used questions
      game.currentQuestionIndex = 0;
      await game.populate('questions');
      const nextQuestion = game.questions[game.currentQuestionIndex];
      await game.save();
      // const teamCount = game.teams.length;
      // const assignedTeamIndex = game.currentQuestionIndex % teamCount;
      // const assignedTeam = game.teams[assignedTeamIndex];
      const assignedTeam = getAssignedTeam(game);
    

    // nextQuestion = game.questions[game.currentQuestionIndex];

      return {
        message: "Next question",
        parentCategory:firstSubcatDoc.parentCategory.name,
        currentRound: game.currentRound,
        // currentQuestionIndex: game.currentQuestionIndex + 1,
        currentQuestionIndex: game.currentQuestionIndex+1,
        question: nextQuestion,
        teams: game.teams,
        gameId: game._id,
        assignedTeam
      };
    } else {
      // All rounds completed → End game
      game.status = "completed";
      await game.save();
      return { message: "No more questions available. Game over!" };
    }
  }

  // Get the next question
  const nextQuestion = game.questions[game.currentQuestionIndex+1];

  // Move to the next question
  game.currentQuestionIndex += 1;
  await game.save();
  // const teamCount = game.teams.length;
  // const assignedTeamIndex = game.currentQuestionIndex % teamCount;
  // const assignedTeam = game.teams[assignedTeamIndex];
  const assignedTeam = getAssignedTeam(game);

  
// console.log("next question: " + nextQuestion)
  return {
    message: "Next question",
    parentCategory:firstSubcatDoc.parentCategory.name,
    currentRound: game.currentRound,
    // currentQuestionIndex: game.currentQuestionIndex + 1,
    currentQuestionIndex: game.currentQuestionIndex+1,
    question: nextQuestion,
    teams: game.teams,
    gameId: game._id,
    assignedTeam
  };
};

// Retrieve details of a specific game session
export const getGameById = async (id) => {
  // Populate necessary references to provide complete details about the game.
  return await Game.findById(id)
    .populate("category")
    .populate({
      path: "questions",
      model: "Question",
      populate: {
        path: "category",
        model: "Category",
      },
    });
};

// Retrieve a list of game categories
export const getGamesCategories = async () => {
  // Simply fetch all categories; might join to games if necessary to show games per category.
  return await Category.find({});
};

// Use an in-game lifeline
export const useLifeline = async (gameId, lifelineDetails) => {
  // Apply a lifeline effect to the game, such as skipping a question or revealing a hint.
  const game = await Game.findById(gameId);
  if (!game) throw new Error("Game not found");
  // Example: Add a hint to the current question
  game.lifelinesUsed.push({
    type: lifelineDetails.type,
    appliedOn: new Date(),
  });
  await game.save();
  return game;
};

// Fetch leaderboard rankings
export const getLeaderboard = async () => {
  // Aggregate games to calculate and sort by scores, assuming scores are stored within teams.
  return await Game.find({ status: "completed" }).sort("-teams.score");
};

// // Fetch a user's game history
// export const getUserGameHistory = async (userId) => {
//   // Find all games where this user was a participant.
//   return await Game.find({ 'teams.members': userId }).sort('-createdAt').populate('category questions');
// };

export const getUserGameHistory = async (userId) => {
  // Assuming that we now track participants directly in the game.
  return await Game.find({ creator: userId })
    .sort("-createdAt")
    .populate("creator category questions");
};

// Create a custom game with specific questions and media
export const createCustomGame = async (customGameDetails) => {
  // Allow more customized settings, including selecting specific questions and setting up teams.
  const game = new Game({
    ...customGameDetails,
    status: "active", // Assume custom games are started immediately.
  });
  return await game.save();
};

// Fetch results and rankings for a completed game
export const getGameResults = async (id) => {
  // Assuming results include scoring and team performance details.
  const game = await Game.findById(id);
  if (!game) throw new Error("Game not found");
  if (game.status !== "completed") throw new Error("Game is not yet completed");
  return game;
};

export const evaluateAnswer = async (gameId, teamId, answer) => {
  try {
    const game = await Game.findById(gameId).populate("questions");
    if (!game) throw new Error("Game not found");

    console.log("game.currentQuestionIndex: ", game.currentQuestionIndex);
    const currentQuestion = game.questions[game.currentQuestionIndex];
    if (!currentQuestion) throw new Error("Question not found");
    // Assuming the answer is correct if it matches the stored answer (simplified)
    if (answer === currentQuestion.correctAnswer) {
      const team = game.teams.find((t) => t._id.toString() === teamId);
      if (!team) throw new Error("Team not found");

      team.score += currentQuestion.points || 10; // Update score, defaulting to 10 points per correct answer
      game.currentQuestionIndex += 1; // Move to the next question

      await game.save();
      return {
        success: true,
        message: "Correct answer!",
        teamScore: team.score,
      };
    } else {
      const team = game.teams.find((t) => t._id.toString() === teamId);
      if (!team) throw new Error("Team not found");
      team.score = currentQuestion.points || 0; // Update score, defaulting to 0 points per wrong answer
      game.currentQuestionIndex += 1;
      return { success: false, message: "Wrong answer", teamScore: team.score };
    }
  } catch (err) {
    console.log("Error in evaluateAnswer: ", err.stack);
    throw new Error(err.message);
  }
};




export const submitScore = async (userId, gameId, teamId) => {
  let game = await Game.findById(gameId);

  if (!game) {
    throw new Error("Game not found.");
  }

  if (game.status === 'completed') {
    return { message: "Game is already completed." };
  }

  // Find the team in the game
  const team = game.teams.find(t => t._id.toString() === teamId);
  
  if (!team) {
    return { message: "Invalid team ID." };
  }

  if (game.currentQuestionIndex >= game.questions.length) {
    return { message: "No more questions available. Game over!" };
  }

  const currentQuestionId = game.questions[game.currentQuestionIndex];

 
  // team.score += 10;
  const pointsAwarded = 10 * game.currentRound;
  team.score += pointsAwarded;
  const logEntry = {
    gameId: game._id.toString(),
    teamId: team._id.toString(),
    questionId: currentQuestionId.toString(),
    questionIndex: game.currentQuestionIndex,
    pointsAwarded: pointsAwarded,
    timestamp: new Date()
  };

  console.log("Score Log:", logEntry);

  // Save the game with updated score
  await game.save();

  return { 
    message: `${pointsAwarded} points awarded to the team.`,
    gameId: game._id,
    teamId: team._id,
    teamDetais:team,
    userId:userId,
    questionId: currentQuestionId,
    updatedScore: team.score,
    questionIndex: game.currentQuestionIndex,
  };
};


export const getTeamScores = async (gameId) => {
  const game = await Game.findById(gameId);
  if (!game) {
    throw new Error("Game not found");
  }

  const sortedTeams = game.teams.sort((a, b) => b.score - a.score);

  const teamScores = sortedTeams.map(team => ({
    name: team.name,
    score: team.score
  }));

  return { teams: teamScores };
};

