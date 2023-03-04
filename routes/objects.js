import express from 'express';
import { objectsUpdate } from '../controllers/objects.js';
import gameData from '../models/gameData.js';

const router = express.Router();

// Define message API routes
router.post('/object/objectsUpdate', (req, res) => objectsUpdate(req, res, gameData));

export default router;
