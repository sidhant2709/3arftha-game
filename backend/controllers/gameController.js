import * as gameService from '../services/gameService.js';

export const startGame = async (req, res) => {
  try {
    const userId = req.params.userId;
    // const game = await gameService.startNewGame(req.body);
    const game = await gameService.startNewGame(userId,req.body);
    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGame = async (req, res) => {
  try {
    const game = await gameService.getGameById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGamesCategories = async (req, res) => {
  try {
    const categories = await gameService.getGamesCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const useLifeline = async (req, res) => {
  try {
    const result = await gameService.useLifeline(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await gameService.getLeaderboard();
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGameHistory = async (req, res) => {
  try {
    const history = await gameService.getUserGameHistory(req.params.user_id);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCustomGame = async (req, res) => {
  try {
    const game = await gameService.createCustomGame(req.body);
    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGameResults = async (req, res) => {
  try {
    const results = await gameService.getGameResults(req.params.id);
    if (!results) {
      return res.status(404).json({ message: 'Results not found for this game' });
    }
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const submitAnswer = async (req, res) => {
  const { gameId, teamId, answer } = req.body; // Ensure you get the gameId from `req.params.id`

  try {
    const result = await gameService.evaluateAnswer(gameId, teamId, answer);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const handleAnswerSubmission = async (req, res) => {
  try {
    const { userId, gameId, teamId } = req.body;

    if (!userId || !gameId || !teamId) {
      return res.status(400).json({ message: "userId, gameId, and teamId are required." });
    }

    const result = await gameService.submitScore(userId, gameId, teamId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const leaderBoard = async (req, res) => {
  try {
    const { gameId } = req.params; 
    const result = await gameService.getTeamScores(gameId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}