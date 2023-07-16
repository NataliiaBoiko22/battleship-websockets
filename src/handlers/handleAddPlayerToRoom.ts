import { InMemoryDB } from "../database/database";
import { Server as WebSocketServer, WebSocket } from "ws";
import { sendWebSocketMessage } from "./sendWSmessage";
import { handleUpdateRoom } from "./handleUpdateRoom";
import { Room } from "../database/Room";
import { roomInstances } from "../database/database";
const db = InMemoryDB.getInstance();

export function handleAddPlayerToRoom(
  // room: Room, 
   ws: WebSocket,
  data: any,
  username: string
): void {

  console.log("HANDLEUPDATEROOOOM");
  const indexRoom = Number(data.indexRoom);
  console.log('data', data);
  console.log('indexRoom', indexRoom);

  const room = db.getRooms().find((r) => {
    console.log('r.roomId', r.roomId);
    console.log('indexRoom', indexRoom);
    console.log('indexRoom === r.roomId', indexRoom === r.roomId);
    return indexRoom === r.roomId;
  });
  // const index = db.addPlayerToRoom(indexRoom, username);

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
  console.log('roomInstance   FROM  HANDLEUPDATEROOOOM ', roomInstance);
  if (!roomInstance) {
    throw new Error("Room not found");
  }
  // const index = db.addPlayerToRoom(indexRoom, username);

  // const addUserToRoomData = {
  //   type: "add_user_to_room",
  //   data: {
  //     indexRoom: index,
  //   },
  //   id: 0,
  // };

  // roomInstance.addUser(ws);
  sendWebSocketMessage(ws, JSON.stringify(addUserToRoomData));
  handleUpdateRoom(ws, {});
  //   sendWebSocketMessage(ws, JSON.stringify(addUserToRoomData));
  //   handleUpdateRoom(ws, {});
  }
}
