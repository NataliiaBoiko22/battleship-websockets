// import { InMemoryDB } from "../database/database";
// import { Server as WebSocketServer, WebSocket } from "ws";
// import {
//   IRegResponse,
//   IRegRequest,
//   IPlayer,
//   IUpdateWinnersResponse,
// } from "database/models";
// import { sendWebSocketMessage } from "../hanlers/sendWSmessage";
// import { handleUpdateRoom } from "../hanlers/handleUpdateRoom";

// const db = InMemoryDB.getInstance();

// function startGame(ws: WebSocket, data: any): void {
//   const room = db.getRooms().find((r) => {
//     console.log("r.roomId", r.roomId);
//     return r.roomId === indexRoom;
//   });
//   if (room.roomUsers.length === 2) {
//     startGame(ws, data);
//   }

//   const createGameResponse = {
//     type: "create_game",
//     data: {
//       idGame: indexRoom,
//       idPlayer: index,
//     },
//     id: data.id,
//   };

//   sendWebSocketMessage(ws, JSON.stringify(createGameResponse));
//   handleUpdateRoom(ws, data);
// }
