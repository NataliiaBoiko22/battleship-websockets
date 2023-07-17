import { InMemoryDB } from "../database/database";
import { Server as WebSocketServer, WebSocket } from "ws";

import { sendWebSocketMessage } from "./sendWSmessage";
import { Room } from "../database/Room";
import { roomInstances } from "../database/database";
import { updateRoomList } from "../helpers/updateRoomList";
const db = InMemoryDB.getInstance();
export function handleCreateRoom(ws: WebSocket, data: any, username: string) {
  const roomId = db.createRoom();
  const index = db.addPlayerToRoom(roomId, username);
  const addUserToRoomData = {
    type: "add_user_to_room",
    data: {
      indexRoom: index,
    },
    id: 0,
  };
  db.getRooms();
  const roomInstance = new Room(roomId);
  roomInstance.addUser(ws);
  roomInstances[roomId] = roomInstance;
  if (roomInstance.getSockets().length === 2) {
    return;
  }
  sendWebSocketMessage(ws, JSON.stringify(addUserToRoomData));
  updateRoomList();
}
