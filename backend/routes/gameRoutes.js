import express from 'express';
import {
  startGame,
  getGame,
  getGamesCategories,
  useLifeline,
  getLeaderboard,
  getGameHistory,
  createCustomGame,
  getGameResults,
  submitAnswer,
  handleAnswerSubmission,
  leaderBoard
} from '../controllers/gameController.js';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();
// authorizeRoles("admin"),

router.post('/:userId/start',authenticate, startGame);  // Only admins can start a game
router.get('/:gameId/leaderBoard',authenticate, leaderBoard);
// router.get('/categories', authenticate, getGamesCategories);  // Any authenticated user can view game categories
// router.get('/categories', authenticate, getGamesCategories);  // Any authenticated user can view game categories
router.get('/categories', authenticate, getGamesCategories);  // Any authenticated user can view game categories
// router.get('/leaderboard',authenticate, getLeaderboard);  // Any authenticated user can view leaderboard
router.get('/:id',authenticate,  getGame);  // Any authenticated user can view game details
router.post('/:id/lifeline', authenticate, useLifeline);  // Any authenticated user can use lifelines
router.get('/history/:user_id',authenticate, getGameHistory);  // Users can view their own history
router.post('/custom',authenticate,createCustomGame);  // Only premium  can create custom games
router.get('/results/:id',authenticate, getGameResults);  // Any authenticated user can view game results
router.post('/answer',authenticate, submitAnswer);  // Allows authenticated users to submit answers
router.post('/submit-answer',handleAnswerSubmission)

export default router;
