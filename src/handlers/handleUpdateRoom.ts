import { InMemoryDB } from "../database/database";
import { Server as WebSocketServer, WebSocket } from "ws";
import { IUpdateRoomResponse } from "database/models";
import { sendWebSocketMessage } from "./sendWSmessage";
const db = InMemoryDB.getInstance();

export function handleUpdateRoom(ws: WebSocket , data: any) {
  const updatedRooms = db.updateRoom();
  const updatedRoomsInner = JSON.stringify(updatedRooms);

  const updateRoomResponse: IUpdateRoomResponse = {
    type: "update_room",
    data: updatedRoomsInner,
    id: 0,
  };

  const updateRoomResponseJSON = JSON.stringify(updateRoomResponse);

  sendWebSocketMessage(ws, updateRoomResponseJSON);
}
