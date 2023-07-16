import { InMemoryDB } from "../database/database";
import { Server as WebSocketServer, WebSocket } from "ws";
import { Room } from "../database/Room";
import { createShipsData } from "../helpers/createShipsData";
import { sendWebSocketMessage } from "./sendWSmessage";
const db = InMemoryDB.getInstance();
export function handleStartGame(ws: WebSocket, data: any,  roomInstance: Room) {
  const innerData = JSON.parse(data.data);

  const ships = createShipsData(innerData, roomInstance);
  roomInstance.setShipsData(innerData.indexPlayer, ships);
  const inDataStart = {
    ships: innerData.ships,
    currentPlayerIndex: innerData.indexPlayer,
  };
  const innerDataStart = JSON.stringify(inDataStart);
  const startGameData = {
    type: "start_game",
    data: innerDataStart,
    id: 0,
  };

  sendWebSocketMessage(ws, JSON.stringify(startGameData));
    roomInstance.switchActivePlayer();
}
