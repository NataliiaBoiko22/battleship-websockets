import { InMemoryDB } from "../database/database";
import { Server as WebSocketServer, WebSocket } from "ws";
import {
  IRegResponse,
  IRegRequest,
  IPlayer,
  IUpdateWinnersResponse,
} from "database/models";
import { sendWebSocketMessage } from "../hanlers/sendWSmessage";
import { handleUpdateRoom } from "../hanlers/handleUpdateRoom";

export function handleStartGame(ws: WebSocket, data: any) {
  console.log("Datd from createroom:", data);
  console.log("Datd ID from createroom:", data.id);
  //   const { idGame, idPlayer } = data.data;

  const startGameResponse = {
    type: "start_game",
    data: {
      message: "Game started",
      //   gameId: idGame,
      //   playerId: idPlayer,
    },
    id: data.id,
  };

  sendWebSocketMessage(ws, JSON.stringify(startGameResponse));
}
