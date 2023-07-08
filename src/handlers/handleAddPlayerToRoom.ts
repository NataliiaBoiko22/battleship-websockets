import { InMemoryDB } from "../database/database";
import { Server as WebSocketServer, WebSocket } from "ws";
import { sendWebSocketMessage } from "./sendWSmessage";
import { handleUpdateRoom } from "./handleUpdateRoom";
import { Room } from "./Room";
import { roomInstances } from "../database/database";
const db = InMemoryDB.getInstance();

export function handleAddPlayerToRoom(
  ws: WebSocket,
  data: any,
  username: string
): void {
  console.log("ADD PLAYER TO ROOM");
  const indexRoom = Number(data.indexRoom);
  // console.log("indexRoom from handleAddPlayerToRoom", indexRoom);
  const playerName = username;
  // console.log("username from handleAddPlayerToRoom", playerName);

  const room = db.getRooms().find((r) => {
    // console.log("r.roomId", r.roomId);
    return r.roomId === indexRoom;
  });
  // console.log("room find on index", room);
  // console.log("ROOMS::");
  // db.getRooms();
  const index = db.addPlayerToRoom(indexRoom, username);

  //   const user = JSON.parse(data.data);
  if (room) {
    console.log("IF ROOOM");
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
