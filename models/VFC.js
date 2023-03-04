// Define a GameObject class
export class GameObject {
  constructor(position) {
    this.id = GameObject.nextId(); // generate a unique ID for the object
    this.position = position;
    this.dirty = false;
  }

  getId(){
    return this.id
  }

  getPosition(){
    return this.position
  }

  isDirty() {
    return this.isDirty
  }

  // Method for updating the object's state
  update(position) {
    // Update the object's position
    this.position[0] = position[0];
    this.position[1] = position[1];
  }

  // Method for sending state updates to clients
  sendStateUpdate(server) {
    // Send the object's state to the server
    const message = {
      type: 'state-update',
      objectId: this.id,
      position: this.position,
    }
    // send message
    // server.send(JSON.stringify(message));
    // now I use other method instead 
    // but in the real world we need to send some info out ot server
  }

  static nextId() {
    if (!GameObject.latestId) {
      GameObject.latestId = 1;
    } else {
      GameObject.latestId += 1;
    }
    return GameObject.latestId;
  }
}

// Define a Client class
// done, well, kinda
export class Client {
  constructor() {
    this.id = Client.nextId()
    // this.address = address;
    this.gameState = {objects:[]};
    this.dirtyObjects = [];
  }

  // Method for receiving state updates from the server
  receiveStateUpdate(object) {
    // Update the client's copy of the game state with the new object data
    this.gameState.objects.forEach(obj => {
      if (object.getId() === obj.getId()) {
        obj = object
        return
      }
    })
  }

  getId() {
    return this.id
  }

  static nextId() {
    if (!Client.latestId) {
      Client.latestId = 1;
    } else {
      Client.latestId += 1;
    }
    return Client.latestId;
  }
}

// Whenever we add new client/ object, we assume it dirty
export class DirtyList {
  constructor(Players, Objects) {
    this.Players = Players
    this.numPlayers = Players.length;
    this.numObjects = Objects.length;
    this.data = Objects.map(obj => ({latestData: obj, DirtyClients: Players}))
  }
  
  isDirty(objectId, clientId) {
    let object = {}
    this.data.forEach(obj => {
      if (obj.latestData.getId() == objectId){
        object = obj
      }
    });
    if (JSON.stringify(object) === '{}') return false
    if (object.DirtyClients.includes(clientId)) {
      return true;
    }
    return false;
  }

  // when dirty list receive upadte info AFTER currentStateMap handle the logic
  updateObject(object, clientIds) {
    let objectId = object.getId()
    this.data.forEach(obj => {
      if (obj.latestData.getId() === objectId){
        obj.latestData = object
        obj.DirtyClients = clientIds
      }
    })
  }

  cleanDirty(objectId, clientId) {
    this.data.forEach(obj => {
      if (obj.latestData.getId() === objectId){
        obj.DirtyClients = obj.DirtyClients.filter(item => item !== clientId);
      }
    })
  }

  addGameObject(object) {
    this.data.push({latestData: object, DirtyClients: this.Players})
    this.numObjects++
  }

  receiveObjectUpdate(object) {
    this.data.forEach(obj => {
      if (obj.latestData.getId() === object.getId()){
        obj.latestData = object
        obj.DirtyClients = this.Players
        return
      }
    })
    this.addGameObject(object)
  }
}

export class CurrentStateMap {
  constructor(Players, Objects) {
    this.data = new Map();
    for (const player of Players) {
      const playerData = new Map();
      for (const object of Objects) {
        playerData.set(object.getId(), {time: -1, sequence: 0, value: {position: [0, 0]} });
      }
      this.data.set(player.getId(), playerData);
    }
  }

  setTime(playerId, objectId, time) {
    this.data.get(playerId).get(objectId).time = time;
  }

  setSequence(playerId, objectId, sequence) {
    this.data.get(playerId).get(objectId).sequence = sequence;
  }

  setValue(playerId, objectId, value) {
    this.data.get(playerId).get(objectId).value = value;
  }

  getTime(playerId, objectId) {
    return this.data.get(playerId).get(objectId).time;
  }

  getSequence(playerId, objectId) {
    return this.data.get(playerId).get(objectId).sequence;
  }

  getValue(playerId, objectId) {
    return this.data.get(playerId).get(objectId).value;
  }

  getMap() {
    return this.data
  }

  update(playerId, objectId, time, value) {
    this.setSequence(playerId, objectId, 0)
    this.setTime(playerId, objectId, time)
    this.setValue(playerId, objectId, value)
  }
}

export class Server {
  constructor(Players, Objects) {
    this.positionLimit = 5;
    this.sequenceLimit = 10;
    this.timeLimit = 1 * 1000; // milli second
    this.dirtyList = new DirtyList(Players, Objects);
    this.currentStateMap = new CurrentStateMap(Players, Objects);
    this.gameObjects = Objects;
    this.clients = Players;
    this.currentTime = new Date();
  }

  updateStateMap(object) {
    let clientsNeedUpdate = []
    let objId = object.getId()
    this.currentStateMap.getMap().forEach((subMap, playerId) => {
      let vector = subMap.get(objId)
      if (vector.time === -1 
        || new Date() - vector.time > this.timeLimit 
        || vector.sequence > this.sequenceLimit 
        || vector.value.position[0] - object.getPosition()[0] > this.positionLimit
        || vector.value.position[1] - object.getPosition()[1] > this.positionLimit) {
        this.currentStateMap.update(playerId, objId, new Date(), {position: object.getPosition()})
        clientsNeedUpdate.push(playerId)
      } 
    });
    return clientsNeedUpdate
  }

  setPositionLimit(limit) {
    this.positionLimit = limit
  }

  setSequenceLimit(limit) {
    this.sequenceLimit = limit
  }

  setTimeLimit(limit) { // input second as unit 
    this.timeLimit = limit * 1000 // second to millisecond, ex: 5 sec -> 5000 millisec
  }

  getTimeLimit() {
    return this.timeLimit
  }

  getSequenceLimit() {
    return this.sequenceLimit
  }

  getPositionLimit() {
    return this.positionLimit
  }
}


