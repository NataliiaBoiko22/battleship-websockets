import { InMemoryDB } from "../database/database";
import { Server as WebSocketServer, WebSocket } from "ws";
import {
  IRegResponse,
  IRegRequest,
  IPlayer,
} from "database/models";
import { sendWebSocketMessage } from "../hanlers/sendWSmessage";
import { handleUpdateRoom } from "./handleUpdateRoom";
export const playerMap = new Map<WebSocket, string>();

const db = InMemoryDB.getInstance();
export function handleRegistration(ws: WebSocket, data: any) {
  console.log("data befor reg", data);
  const user = JSON.parse(data.data);

  const regRequest: IRegRequest = {
    type: data.type,
    data: JSON.parse(data.data),
    id: data.id,
  };
  const { name, password } = regRequest.data;
  const player: IPlayer = {
    name,
    password,
    wins: 0,
  };
  const index = db.getIndexRegisterPlayer(player);

  const innerData = {
    name: JSON.stringify(user.name),
    index,
    error: false,
    errorText: "error",
  };

  const regResponse: IRegResponse = {
    type: "reg",
    data: JSON.stringify(innerData),
    id: regRequest.id,
  };
  const regResponseJSON = JSON.stringify(regResponse);
  db.registerPlayer(player);
  // console.log("player from handleRegistration", player);
  // console.log("data.username", JSON.stringify(user.name));
  playerMap.set(ws, JSON.stringify(user.name));
  sendWebSocketMessage(ws, regResponseJSON);
  const rooms = db.getRooms();
  if (rooms.length > 0) {
    handleUpdateRoom(ws, data);
  }
}
