import { InMemoryDB } from "../database/database";
import { Server as WebSocketServer, WebSocket } from "ws";
import {
  IRegResponse,
  IRegRequest,
  IPlayer,
  IUpdateWinnersResponse,
} from "database/models";
import { sendWebSocketMessage } from "../hanlers/sendWSmessage";
const db = new InMemoryDB();

export function handleUpdateWinners(ws: WebSocket, data: any) {
  const winners = db.updateWinners();
  const updateWinnersResponse: IUpdateWinnersResponse = {
    type: "update_winners",
    data: winners,
    id: data.id,
  };

  sendWebSocketMessage(ws, JSON.stringify(updateWinnersResponse));
}
