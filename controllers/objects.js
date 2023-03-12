import gameData from "../models/gameData.js"

async function objectsUpdate(req, res) {
  const data = req.body
  try {
    gameData.updateStateMapById(data.id, data.location) 
    return res.status(200).json({
      msg: "updated"
    }); 
  } catch (error) {
    return res.status(401).json({
      msg: "update failed"
    });
  }
}


export {objectsUpdate}