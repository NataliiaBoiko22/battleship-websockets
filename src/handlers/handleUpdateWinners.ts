import { InMemoryDB } from "../database/database";
import { Server as WebSocketServer, WebSocket } from "ws";
import { IUpdateRoomResponse } from "database/models";
import {
  IRegResponse,
  IRegRequest,
  IPlayer,
  IUpdateWinnersResponse,
} from "database/models";
import { sendWebSocketMessage } from "./sendWSmessage";
const db = InMemoryDB.getInstance();

export function handleUpdateWinners(ws: WebSocket, data: any) {

  console.log("HANDLEUPDATEWINNNNNERS");
  const winners = db.updateWinners();
  const innerWinners = JSON.stringify(winners[0])
  console.log('winners', winners);
  console.log('winners[0]', winners[0]);

  const updateWinnersResponse: IUpdateWinnersResponse = {
    type: "update_winners",
    data: innerWinners,
    id: 0,
  };

  console.log('HHHHHHHHhandleUpdateWinners', JSON.stringify(updateWinnersResponse) );
  sendWebSocketMessage(ws, JSON.stringify(updateWinnersResponse));
  // handleClearRoom(ws, data)

}
// function handleClearRoom(ws: WebSocket , data: any) {
//   console.log("UPDATE Clean  ROOM");

//   const updateRoomCleanResponse: IUpdateRoomResponse = {
//     type: "update_room",
//     data: JSON.stringify({}),
//     id: 0,
//   };

//   console.log("updateRoomCleanResponse", updateRoomCleanResponse);
//   sendWebSocketMessage(ws, JSON.stringify(updateRoomCleanResponse));
// }