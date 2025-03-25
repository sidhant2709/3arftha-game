import express from "express";
import { trialGameHandler } from "../controllers/trialGameController.js";

const router = express.Router();

// POST /api/trial-game
router.post("/:userId", trialGameHandler);

export default router;
