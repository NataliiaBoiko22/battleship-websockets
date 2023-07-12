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
    return r.roomId === indexRoom;
  });
  const index = db.addPlayerToRoom(indexRoom, username);

  if (room) {
    const addUserToRoomData = {
      type: "add_user_to_room",
      data: {
        indexRoom: index,
      },
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
    sendWebSocketMessage(ws, JSON.stringify(addUserToRoomData));
    handleUpdateRoom(ws, {});
  }
}
