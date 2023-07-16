import { InMemoryDB } from "../database/database";

const db = InMemoryDB.getInstance();

export function findExistingRoom() {
  const rooms = db.getRooms();
  const availableRooms = rooms.filter(room => room.roomUsers.length < 2);
  if (availableRooms.length > 0) {
    return availableRooms[0].roomId;
  }
  return null;
}
