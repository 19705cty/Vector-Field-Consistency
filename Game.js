import { GameObject, DirtyList, Client, CurrentStateMap} from "./VFC.js";

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


let currentStateMap = new CurrentStateMap(Players, GameObjects)

// some test

// console.log(currentStateMap)
// console.log(currentStateMap)
// console.log(currentStateMap.getTime(3,4))
// currentStateMap.setTime(3,4,10)
// console.log(currentStateMap.getTime(3,4))


// let l = new DirtyList([1,2,3], [a, b, c])

// console.log(l)
// l.addGameObject(new GameObject([4,4]))
// console.log(l)
// console.log("object 1 is dirty for client2?", l.isDirty(1,2))
// l.cleanDirty(1,2)
// console.log("object 1 is dirty for client2?", l.isDirty(1,2))
// l.setDirty(1,2)
// console.log("object 1 is dirty for client2?", l.isDirty(1,2))
