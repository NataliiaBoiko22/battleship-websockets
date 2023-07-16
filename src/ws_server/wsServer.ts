import { Server as WebSocketServer, WebSocket } from "ws";
import { handleRegistration } from "../handlers/handleRegistration";
import { handleUpdateWinners } from "../handlers/handleUpdateWinners";
import { handleCreateRoom } from "../handlers/handleCreateRoom";
import { handleAddPlayerToRoom } from "../handlers/handleAddPlayerToRoom";
import { handleUpdateRoom } from "../handlers/handleUpdateRoom";
import { handleStartGame } from "../handlers/handleStartGame";
import { handleAttack } from "../handlers/handlerAttack";
import { handleRandomAttack } from "../handlers/handleRandomAttack";
import { Server as HttpServer } from "http";
import { playerMap } from "../handlers/handleRegistration";
import { findExistingRoom } from "../helpers/findExistingRoom";
import { roomInstances } from "../database/database";
const WS_PORT = 3000;
export const connections: WebSocket[] = [];
export function startWebSocketServer(httpServer: HttpServer) {
  const wsServer = new WebSocketServer({ port: WS_PORT });

  wsServer.on("connection", (ws: WebSocket ) => {
    console.log("New WebSocket connection");
    connections.push(ws);
    ws.on("error", console.error);

    ws.on("message", (message: string) => {
      const data = JSON.parse(message);

      if (data.type === "reg") {
        handleRegistration(ws, data);
      } else if (data.type === "update_winners") {
        handleUpdateWinners(ws, data);
      } else if (data.type === "create_room") {
        const username = playerMap.get(ws);
        if (username) {
            handleCreateRoom(ws, data, username);
          }
      } else if (data.type === "add_user_to_room") {
        const username = playerMap.get(ws);
        if (username) {
          const existingRoomId = findExistingRoom();
          if (existingRoomId) {
            const roomInstance = roomInstances[existingRoomId];
            const existingRoomIdInner = JSON.stringify(existingRoomId);
            handleAddPlayerToRoom(
              ws,
              { indexRoom: existingRoomIdInner },
              username
            );
          }
        }
      } else if (data.type === "update_room") {
        handleUpdateRoom(ws, data);
      } else if (data.type === "add_ships") {
        const innerData = JSON.parse(data.data);
        const roomId = innerData.gameId.slice(0,1);
        const roomInstance = roomInstances[roomId];
        handleStartGame(ws, data, roomInstance);
      } else if (data.type === "attack") {
        const innerData = JSON.parse(data.data);
        const roomId = innerData.gameId.slice(0,1);
        const roomInstance = roomInstances[roomId];
        handleAttack(ws, data, roomInstance);
      } else if (data.type === "randomAttack") {
        const innerData = JSON.parse(data.data);
        const roomId = innerData.gameId.slice(0,1);
        const roomInstance = roomInstances[roomId];
        handleRandomAttack(ws, data, roomInstance);
      }

      ws.on("close", () => {
        console.log("WebSocket connection closed");
        const index = connections.indexOf(ws);
        if (index !== -1) {
          connections.splice(index, 1);
        }
      });
    });
  });
}
