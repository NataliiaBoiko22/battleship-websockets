import { InMemoryDB } from "../database/database";
import { Server as WebSocketServer, WebSocket } from "ws";
import {
  IRegResponse,
  IRegRequest,
  IPlayer,
  IUpdateWinnersResponse,
} from "database/models";
import { sendWebSocketMessage } from "./sendWSmessage";
import { handleUpdateRoom } from "./handleUpdateRoom";
const db = InMemoryDB.getInstance();
export function handleStartGame(ws: WebSocket, data: any) {
  console.log("DATA IN handleStartGame", data);
  const innerData = JSON.parse(data.data);
  // const ships = JSON.stringify(innerData.ships);
  // console.log("SHIPS", ships);
  // const currentPlayerIndex = innerData.indexPlayer;
  // console.log("data.data.indexPlayer", currentPlayerIndex);
  // const innerShips = JSON.stringify(ships);
  // console.log("innerShips", innerShips);
  // Подготовка ответа startGameData
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
  const currentPlayerInner = {
    currentPlayer: data.data.indexPlayer,
  };
  const indexPlayerInner = JSON.stringify(currentPlayerInner);
  const turnData = {
    type: "turn",
    data: indexPlayerInner,
    id: 0,
  };

  sendWebSocketMessage(ws, JSON.stringify(turnData));
}
