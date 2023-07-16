import { InMemoryDB } from "../database/database";
import { Server as WebSocketServer, WebSocket } from "ws";
import {
 
  IUpdateWinnersResponse,
} from "database/models";
import { sendWebSocketMessage } from "./sendWSmessage";
const db = InMemoryDB.getInstance();

export function handleUpdateWinners(ws: WebSocket, data: any) {
  const winners = db.updateWinners();
  const innerWinners = JSON.stringify(winners[0])
  const updateWinnersResponse: IUpdateWinnersResponse = {
    type: "update_winners",
    data: innerWinners,
    id: 0,
  };

  sendWebSocketMessage(ws, JSON.stringify(updateWinnersResponse));

}
