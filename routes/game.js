import express from 'express';
// import { objectsUpdate } from './controllers/objects.js';
import { logGameInfo, startNewGame } from '../controllers/game.js';
import gameData from '../models/gameData.js';

const router = express.Router();

router.get('/logGameInfo', (req, res) => logGameInfo(req, res));
router.get('/startNewGame', (req, res) => startNewGame(req, res));

export default router;