import { InMemoryDB } from "../database/database";
import { Server as WebSocketServer, WebSocket } from "ws";

import { sendWebSocketMessage } from "./sendWSmessage";
import { handleUpdateRoom } from "./handleUpdateRoom";
import { Room } from "../database/Room";
import { roomInstances } from "../database/database";
import { updateRoomList } from "../helpers/updateRoomList";
import { handleAddPlayerToRoom } from "./handleAddPlayerToRoom";
// import { handleAttack } from "./handlerAttack";
const db = InMemoryDB.getInstance();
export function handleCreateRoom(ws: WebSocket, data: any, username: string) {
  console.log("CREATE ROOM");
  db.getPlayers();
  console.log("handleCreateRoom data", data);
  console.log("handleCreateRoom userName", username);
  const roomId = db.createRoom();
  console.log("roomId roomId", roomId);
  const index = db.addPlayerToRoom(roomId, username);
  console.log("index index", index);
  const addUserToRoomData = {
    type: "add_user_to_room",
    data: {
      indexRoom: index,
    },
    id: 0,
  };
  db.getRooms();
  const roomInstance = new Room(roomId);
  console.log("Add FIRST usera to SOCKET");
  roomInstance.addUser(ws);
  roomInstances[roomId] = roomInstance;
  console.log("RRRroomInstance", roomInstance);
  // handleAttack(roomInstance, data);
  // console.log('create room', JSON.stringify(addUserToRoomData));
  if (roomInstance.getSockets().length === 2) {
    // Если в комнате уже два игрока, прекратить дальнейшее выполнение
    return;
  }
  sendWebSocketMessage(ws, JSON.stringify(addUserToRoomData));

  // handleAddPlayerToRoom(ws, data, username);
  updateRoomList();
}
