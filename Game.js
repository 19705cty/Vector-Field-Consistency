import { GameObject, DirtyList, Client, CurrentStateMap, Server} from "./VFC.js";

let obj1 = new GameObject([1,1])
let obj2 = new GameObject([2,2])
let obj3 = new GameObject([3,3])
let obj4 = new GameObject([3,3])


let ply1 = new Client()
let ply2 = new Client()
let ply3 = new Client()
let ply4 = new Client()

let Players = [ply1, ply2, ply3, ply4]
let GameObjects = [obj1, obj2, obj3, obj4]

let sequenceLimit = 5
let timeLimit = 1 // sec
let positionLimit = 10

let server = new Server(Players, GameObjects)

server.setPositionLimit(positionLimit)
server.setSequenceLimit(sequenceLimit)
server.setTimeLimit(timeLimit)

let movingCount = 0
let updateCount = 0
let updateFailedCount = 0 

function simulation() {
  // one object move, random pos
  let newPosition = [Math.floor(Math.random() * 101), Math.floor(Math.random() * 101)]
  let selectedObjIndex = Math.floor(Math.random() * GameObjects.length)

  // update object position 
  GameObjects[selectedObjIndex].update(newPosition)
  movingCount++;
  let movingObject = GameObjects[selectedObjIndex]

  // send to currentStateMap, upadte, and  get list client need to update
  let clientsNeedUpdate = server.updateStateMap(movingObject)

  // if list has smth need to update
  if (clientsNeedUpdate.length > 0) {
    let successUpdated = []
    // update every client
    clientsNeedUpdate.forEach(clientNeedUpdate => {
    // try update the clients, works, add to list
      try {
        Players.forEach(player => {
          player.receiveStateUpdate(movingObject)
          successUpdated.push(clientNeedUpdate)
          updateCount++;
        })
      } catch (error) {
        updateFailedCount++
        console.log("update failed")
      }
    })
    // update DirtyList
    let DirtyClient = Players.filter((ply) => !successUpdated.includes(ply) )
    server.dirtyList.updateObject(movingObject, DirtyClient)
  } else { 
    // no need to update players but we need to update DirtyList
    // now everyone is dirty since the object updated, but no client upadte the object
    server.dirtyList.updateObject(movingObject, Players)
  }
}

let intervalId = setInterval(simulation, 10); // Run the function every 100 milliseconds


let simulationTime = 5

setTimeout(() => {
  clearInterval(intervalId); // Stop the loop after 5000 milliseconds (5 seconds)
  console.log("In a 100 x 100 grid, when ")
  console.log("  sequence limit is", server.getSequenceLimit())
  console.log("  time limit is", server.getTimeLimit())
  console.log("  position limit is", server.getPositionLimit())
  console.log('Game Stop after', simulationTime, "sec" );
  console.log("game objects moving ", movingCount, "times")
  console.log("updated ", updateCount, "times")
  console.log("updated  Failed", updateFailedCount, "times")
}, simulationTime * 1000);

