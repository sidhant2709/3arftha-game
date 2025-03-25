import { startOrContinueTrial } from "../services/trialGameService.js";

/**
 * POST /api/trial-game
 * Start or continue the user's trial game
 */
export const trialGameHandler = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming user is authenticated
    const trialDetails = req.body; // e.g. { categoryId: "..." }

    const response = await startOrContinueTrial(userId, trialDetails);
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error in trialGameHandler:", error);
    return res.status(400).json({ error: error.message });
  }
};
