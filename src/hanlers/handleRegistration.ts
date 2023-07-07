import { InMemoryDB } from "../database/database";
import { Server as WebSocketServer, WebSocket } from "ws";
import {
  IRegResponse,
  IRegRequest,
  IPlayer,
  IUpdateWinnersResponse,
} from "database/models";
import { sendWebSocketMessage } from "../hanlers/sendWSmessage";
import { handleCreateRoom } from "./handleCreateRoom";
export const playerMap = new Map<WebSocket, string>();

// const db = new InMemoryDB();
const db = InMemoryDB.getInstance();
export function handleRegistration(ws: WebSocket, data: any) {
  console.log("data befor reg", data);
  const user = JSON.parse(data.data);

  const regRequest: IRegRequest = {
    type: data.type,
    data: JSON.parse(data.data),
    id: data.id,
  };
  // console.log(`Request data:${JSON.stringify(regRequest)}`);
  const { name, password } = regRequest.data;
  const player: IPlayer = {
    name,
    password,
    wins: 0,
  };
  const index = db.getIndexRegisterPlayer(player);
  // console.log(`Index: ${index}`);
  // console.log(`Name : ${regRequest.data.name}`);

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
  // console.log(`Regresponse Stringifi:${JSON.stringify(regResponse)}`);
  const regResponseJSON = JSON.stringify(regResponse);
  console.log("regResponseJSON", regResponseJSON);
  db.registerPlayer(player);
  // const playerName = regRequest.data.name; // Получение имени активного пользователя
  // db.getPlayers();
  console.log("player from handleRegistration", player);
  // db.addPlayer(player);
  // handleCreateRoom(ws, playerName);
  console.log("data.username", JSON.stringify(user.name));
  playerMap.set(ws, JSON.stringify(user.name));
  sendWebSocketMessage(ws, regResponseJSON);
}
