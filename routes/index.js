import express from 'express';
import objectsRoutes from './objects.js';
import gameRoutes from './game.js'
// import gam

// const app = express();
const router = express.Router()

// Define API routes
router.use('/', objectsRoutes);
router.use('/', gameRoutes);

router.get('/indexTest', (req, res) => {
  res.send('index is ok')
})


export default router