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
  console.log("START GAME");
  console.log("Datd ID from createroom:", data.indexRoom);
  const idGame = data.indexRoom; // Идентификатор игры
  // const idPlayer = data.data.idPlayer; // Идентификатор игрока
  // const idPlayer = db.getPlayerIndexByUsername(data.room.roomUsers[1].name); // Get the index of the second player in the room
  // const startGameResponse = {
  //   type: "start_game",
  //   data: {
  //     idGame: idGame,
  //     idPlayer: idPlayer,
  //   },
  //   id: 0,
  // };

  // sendWebSocketMessage(ws, JSON.stringify(startGameResponse));
}
