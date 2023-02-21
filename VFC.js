// Define a GameObject class
// send server not done yet
export class GameObject {
  constructor(position) {
    this.id = GameObject.nextId(); // generate a unique ID for the object
    this.position = position;
    this.dirty = false;
  }

  getId(){
    // console.log("id: ", this.id)
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

  setDirty(objectId, clientId) {
    this.data.forEach(obj => {
      if (obj.latestData.getId() === objectId){
        if (!obj.DirtyClients.includes(clientId)){
          obj.DirtyClients.push(clientId)
          return
        }
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

// kinda done
export class CurrentStateMap {
  constructor(Players, Objects) {
    this.data = new Map();
    for (const player of Players) {
      const playerData = new Map();
      for (const object of Objects) {
        playerData.set(object.getId(), { time: -1, sequence: 0, value: {position: [0, 0]} });
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
}



// have not finished yet
export class Server {
  constructor(numPlayers, numObjects) {
    this.dirtyList = new DirtyList(numPlayers, numObjects);
    this.CurrentStateMap = new CurrentStateMap(numPlayers, numObjects);
    this.gameObjects = [];
    this.clients = [];
    this.currentTime = 0;
  }

  addGameObject(object) {
    this.gameObjects.push(object);
  }

  removeGameObject(object) {
    const index = this.gameObjects.indexOf(object);
    if (index !== -1) {
      this.gameObjects.splice(index, 1);
    }
  }

  addClient(client) {
    this.clients.push(client);
  }

  removeClient(client) {
    const index = this.clients.indexOf(client);
    if (index !== -1) {
      this.clients.splice(index, 1);
    }
  }

  update(dt) {
    for (const object of this.gameObjects) {
      object.update(dt);
      NEW_UPDATE(object, this.clients, this.dirtyList, this.CurrentStateMap, this.currentTime);
    }
    VFC_MONITOR(this.gameObjects, this.clients, this.dirtyList, this.CurrentStateMap, this);
    this.currentTime += dt;
  }

  sendStateUpdate(object, client) {
    // Send the object's state to the client
  }

  // NEW_UPDATE algorithm
  NewUpdate(OBJ, clients, dirtyList, CurrentStateMap, currentTime) {
    for (const c of clients) {
      const vector = CurrentStateMap.getData(c.playerIndex, OBJ.index);
      if (vector.time === -1) {
        vector.time = currentTime;
        vector.sequence++;
        if (vector.value === 0) {
          vector.value += distance(OBJ.current_position, OBJ.new_position);
        }
        dirtyList.setDirty(c.playerIndex, OBJ.index, true);
      }
    }
  }

  // VFC_MONITOR algorithm
  VfcMonitor(OBJECTS, CLIENTS, dirtyList, CurrentStateMap, server) {
    for (const o of OBJECTS) {
      for (const c of CLIENTS) {
        const vector = getMaxConsistencyValues(o, c, CurrentStateMap);
        if (dirtyList.isDirty(c.playerIndex, o.index) && !checkVFCConditions(o, c, vector)) {
          server.sendStateUpdate(o, c);
          updateCurrentStateMap(o, c, CurrentStateMap);
          dirtyList.setDirty(c.playerIndex, o.index, false);
        }
      }
    }
  }

}


