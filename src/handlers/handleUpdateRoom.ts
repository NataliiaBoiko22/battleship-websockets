import { InMemoryDB } from "../database/database";
import { Server as WebSocketServer, WebSocket } from "ws";
import { IUpdateRoomResponse } from "database/models";
import { sendWebSocketMessage } from "./sendWSmessage";
const db = InMemoryDB.getInstance();

export function handleUpdateRoom(ws: WebSocket , data: any) {
  console.log("UPDATE ROOM");
  const updatedRooms = db.updateRoom();
  const updatedRoomsInner = JSON.stringify(updatedRooms);

  const updateRoomResponse: IUpdateRoomResponse = {
    type: "update_room",
    data: updatedRoomsInner,
    id: 0,
  };

  console.log("updateRoomResponse", updateRoomResponse);
  // console.log("updateRoomResponseSTRINGI", JSON.stringify(updateRoomResponse));
  const updateRoomResponseJSON = JSON.stringify(updateRoomResponse);

  sendWebSocketMessage(ws, updateRoomResponseJSON);
}
