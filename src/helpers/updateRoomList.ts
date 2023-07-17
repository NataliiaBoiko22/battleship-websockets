import { InMemoryDB } from "../database/database";
import { connections } from "../ws_server/wsServer";
const db = InMemoryDB.getInstance();

export function updateRoomList() {
  const updatedRooms = db.getRooms();
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
