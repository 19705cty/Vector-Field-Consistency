const objectsMap = new Map();
import { GameObject, DirtyList } from "./VFC.js";

// Add objects to the map
const object1 = { id: 0, name: "Object 1", position: [3,4] };
const object2 = { id: 10, name: "Object 2", obj: new GameObject([3,4])  };
objectsMap.set(object1.id, object1);
objectsMap.set(object2.id, object2);

// Access objects in the map by ID
const obj1 = objectsMap.get(1);
const obj2 = objectsMap.get(3);
const obj10 = objectsMap.get(10);

console.log(obj1)
console.log(obj2)
console.log(obj10)

// Modify objects in the map
// obj1.name = "New name for Object 1";
// objectsMap.set(1, obj1);

// // Remove objects from the map
// objectsMap.delete(2);
