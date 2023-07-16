import { InMemoryDB } from "../database/database";
import { Server as WebSocketServer, WebSocket } from "ws";
import { IRegResponse, IRegRequest, IPlayer } from "database/models";
import { sendWebSocketMessage } from "./sendWSmessage";
import { handleUpdateRoom } from "./handleUpdateRoom";
export const playerMap = new Map<WebSocket, string>();

const db = InMemoryDB.getInstance();

export function handleRegistration(ws: WebSocket, data: any) {
  const user = JSON.parse(data.data);

  const regRequest: IRegRequest = {
    type: data.type,
    data: JSON.parse(data.data),
    id: 0,
  };
  const { name, password } = regRequest.data;
  if (name.length < 5 || password.length < 5) {
    const errorData = {
      name: JSON.stringify(user.name),
      index: 0,
      error: true,
      errorText: "name and password should have a minimum length of 5 characters",
    };

    const regResponse = {
      type: "reg",
      data: JSON.stringify(errorData),
      id: 0,
    };

    sendWebSocketMessage(ws, JSON.stringify(regResponse));
    return;
  }

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
  playerMap.set(ws, JSON.stringify(user.name));
  sendWebSocketMessage(ws, regResponseJSON);
  const rooms = db.getRooms();
  if (rooms.length > 0) {
    handleUpdateRoom(ws, data);
  }
}
