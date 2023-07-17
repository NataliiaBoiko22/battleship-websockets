import { InMemoryDB } from "../database/database";
import { Server as WebSocketServer, WebSocket } from "ws";
import { sendWebSocketMessage } from "./sendWSmessage";
import { handleUpdateRoom } from "./handleUpdateRoom";
import { Room } from "../database/Room";
import { roomInstances } from "../database/database";
const db = InMemoryDB.getInstance();

export function handleAddPlayerToRoom(
   ws: WebSocket,
  data: any,
  username: string
): void {

  const indexRoom = Number(data.indexRoom);
  const room = db.getRooms().find((r) => {
    return indexRoom === r.roomId;
  });

  if (room) {
    const addUserToRoomData = {
      type: "add_user_to_room",
      data: JSON.stringify({
        indexRoom: db.addPlayerToRoom(indexRoom, username),
      }),
      id: 0,
    };
    if (roomInstances[indexRoom]) {
      const roomInstance = roomInstances[indexRoom];
      roomInstance.addUser(ws);
    } else {
      const roomInstance = new Room(indexRoom);
      roomInstance.addUser(ws);
      roomInstances[indexRoom] = roomInstance;
    }
  const roomInstance = roomInstances[indexRoom];
  if (!roomInstance) {
    throw new Error("Room not found");
  }
  sendWebSocketMessage(ws, JSON.stringify(addUserToRoomData));
  handleUpdateRoom(ws, {});
  }
}
