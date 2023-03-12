import express from 'express';
// import { objectsUpdate } from './controllers/objects.js';
import { logGameInfo, startNewGame } from '../controllers/game.js';
import gameData from '../models/gameData.js';

const router = express.Router();

router.get('/logGameInfo', (req, res) => logGameInfo(req, res, gameData));
router.post('/startNewGame', (req, res) => startNewGame(req, res, gameData));

export default router;