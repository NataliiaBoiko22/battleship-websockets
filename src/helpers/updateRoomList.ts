import { InMemoryDB } from "../database/database";
import { connections } from "../ws_server/wsServer";
const db = InMemoryDB.getInstance();

export function updateRoomList() {
  console.log("FROM FUNCTION UPDATE ROOM LIST");
  // const index = rooms.roomId;
  const updatedRooms = db.getRooms();
  console.log('updatedRooms', updatedRooms);
  const updatedRoomsInner = JSON.stringify(updatedRooms);

  const updateData = {
    type: "update_room",
    data: updatedRoomsInner,
  };
  const jsonData = JSON.stringify(updateData);

  connections.forEach((ws) => {
    ws.send(jsonData);
  });
}
