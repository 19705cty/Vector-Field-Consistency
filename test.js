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

// let currentStateMap = new CurrentStateMap(Players, GameObjects)

// let server = new Server(Players, GameObjects)

let CSM = new CurrentStateMap(Players, GameObjects)
console.log(CSM)
console.log(CSM.getSequence(2,2))
CSM.setSequence(2,2,10)
console.log(CSM.getSequence(2,2))

// console.log(CSM)

CSM.update(2, 2, new Date(), {position: [10,10]})
console.log(CSM.getSequence(2,2))
console.log(CSM.getTime(2,2))
console.log(CSM.getValue(2,2))



// let a1 = 1
// let a2 = 2
// let a3 = 3
// let a4 = 4

// let l = [a1, a2, a3, a4]

// function simulation() {
//   // newPosition = [Math.floor(Math.random() * 101), Math.floor(Math.random() * 101)]
//   let pos = Math.floor(Math.random() * 101)
//   let plyIndex = Math.floor(Math.random() * 3) 
//   // let currentPlayer = l[plyIndex]
//   l[plyIndex] = pos
//   console.log("current position: ", l)
// }


// let intervalId = setInterval(simulation, 10); // Run the function every 100 milliseconds

// setTimeout(() => {
//   clearInterval(intervalId); // Stop the loop after 5000 milliseconds (5 seconds)
//   console.log('Game Stop');
// }, 5000);
