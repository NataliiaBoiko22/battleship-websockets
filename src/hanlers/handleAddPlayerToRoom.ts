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

const db = new InMemoryDB();

export function handleAddPlayerToRoom(ws: WebSocket, data: any): void {
  console.log("Data from create room:", data);
  const innerData = JSON.parse(data);
  console.log("innerData", innerData);
  console.log("innerData data", innerData.data);

  console.log("innerData id", innerData.id);
  const { indexRoom } = data.data;
  const username = data.username;
  //   const { indexRoom } = data.data;
  //   console.log(data.data);
  //   console.log(data);
  const room = db.getRooms().find((r) => {
    console.log(r.roomId);

    r.roomId === innerData.id;
  });
  console.log("room", room);
  //   const user = JSON.parse(data.data);
  if (room) {
    const index = db.addPlayerToRoom(indexRoom, username);
    const createGameResponse = {
      type: "create_game",
      data: {
        idGame: 1,
        idPlayer: index,
      },
      id: data.id,
    };

    sendWebSocketMessage(ws, JSON.stringify(createGameResponse));
    handleUpdateRoom(ws, data);
  }
}
