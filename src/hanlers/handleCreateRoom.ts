import { InMemoryDB } from "../database/database";
import { Server as WebSocketServer, WebSocket } from "ws";
import {
  IRegResponse,
  IRegRequest,
  IPlayer,
  IUpdateWinnersResponse,
} from "database/models";
import { sendWebSocketMessage } from "../hanlers/sendWSmessage";
import { handleStartGame } from "../hanlers/handleStartGame";
import { handleUpdateRoom } from "../hanlers/handleUpdateRoom";

const db = InMemoryDB.getInstance();

export function handleCreateRoom(ws: WebSocket, data: any, username: string) {
  db.getPlayers();
  console.log("handleCreateRoom data", data);
  console.log("handleCreateRoom userName", username);
  const roomId = db.createRoom();
  const index = db.addPlayerToRoom(roomId, username);
  const addUserToRoomData = {
    type: "add_user_to_room",
    data: {
      indexRoom: roomId,
    },
    id: 0,
  };
  sendWebSocketMessage(ws, JSON.stringify(addUserToRoomData));
  handleUpdateRoom(ws, data);
}
