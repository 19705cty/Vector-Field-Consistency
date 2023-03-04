import { Server, GameObject, Client } from "./VFC.js";

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

// let gameData = new Server(Players, GameObjects)
let gameData = new Server([], [])


gameData.setPositionLimit(positionLimit)
gameData.setSequenceLimit(sequenceLimit)
gameData.setTimeLimit(timeLimit)
// console.log(gameData)

export default gameData;