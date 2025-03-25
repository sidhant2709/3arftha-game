import express from 'express';
import {
    createQuery,
  getAllQueries,
  getQueryById,
  updateQueryStatus
} from '../controllers/queryController.js';

const router = express.Router();

router.get('/', getAllQueries);
router.get('/:id', getQueryById);
router.put('/:id/status', updateQueryStatus);
router.post('/', createQuery);

export default router;
