import gameData from "../models/gameData.js"

async function logGameInfo(req, res) {
  console.log(gameData)
  return res.status(200).json({
    msg: "only show on the server side."
  });
}

async function startNewGame(res, req, gameData) {
  
}

export {logGameInfo, startNewGame}