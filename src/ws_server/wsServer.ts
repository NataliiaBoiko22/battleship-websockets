import { Server as WebSocketServer, WebSocket } from "ws";
import { handleRegistration } from "../handlers/handleRegistration";
import { handleUpdateWinners } from "../handlers/handleUpdateWinners";
import { handleCreateRoom } from "../handlers/handleCreateRoom";
import { handleAddPlayerToRoom } from "../handlers/handleAddPlayerToRoom";
import { handleUpdateRoom } from "../handlers/handleUpdateRoom";
import { handleStartGame } from "../handlers/handleStartGame";
import { Server as HttpServer } from "http";
import { playerMap } from "../handlers/handleRegistration";
import { findExistingRoom } from "../helpers/findExistingRoom";
const WS_PORT = 3000;
export const connections: WebSocket[] = [];
// console.log("playerMap", playerMap);
export function startWebSocketServer(httpServer: HttpServer) {
  // const wsServer = new WebSocketServer({ server: httpServer });
  const wsServer = new WebSocketServer({ port: WS_PORT });

  wsServer.on("connection", (ws) => {
    console.log("New WebSocket connection");
    connections.push(ws);
    ws.on("error", console.error);

    ws.on("message", (message: string) => {
      console.log(`Received message: ${message}`);
      const data = JSON.parse(message);
      // const user = JSON.parse(data.data);
      console.log(`After parse: ${JSON.stringify(data)}`);

      if (data.type === "reg") {
        handleRegistration(ws, data);
      } else if (data.type === "update_winners") {
        handleUpdateWinners(ws, data);
      } else if (data.type === "create_room") {
        const username = playerMap.get(ws);
        console.log("username from wsMAP", username);
        if (username) {
          const existingRoomId = findExistingRoom();
          if (existingRoomId) {
            const existingRoomIdInner = JSON.stringify(existingRoomId);
            handleCreateRoom(ws, data, username);
            handleAddPlayerToRoom(
              ws,
              { indexRoom: existingRoomIdInner },
              username
            );
          } else {
            handleCreateRoom(ws, data, username);
          }
        } else {
          console.error("Username not found");
        }
      } else if (data.type === "add_user_to_room") {
        const username = playerMap.get(ws);
        console.log("username from wsMAP", username);
        if (username) {
          const existingRoomId = findExistingRoom();
          if (existingRoomId) {
            const existingRoomIdInner = JSON.stringify(existingRoomId);
            handleAddPlayerToRoom(
              ws,
              { indexRoom: existingRoomIdInner },
              username
            );
          }
        } else {
          console.error("Username not found");
        }
        //     // Handle ahandleAddPlayerToRoom(data);dd player to room request
      } else if (data.type === "create_game") {
        handleStartGame(ws, data);
        //     // Handle ahandleAddPlayerToRoom(data);dd player to room request
      } else if (data.type === "update_room") {
        handleUpdateRoom(ws, data);
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
