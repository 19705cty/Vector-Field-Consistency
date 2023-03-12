import gameData from "../models/gameData.js"
import { GameObject, Client, Server} from "../models/VFC.js";

async function logGameInfo(req, res) {
  console.log(gameData)
  return res.status(200).json({
    msg: "only show on the server side."
  });
}

async function startNewGame(req, res) {
  return res.status(200).json({
    msg: "only show on the server side."
  });
}

export {logGameInfo, startNewGame}