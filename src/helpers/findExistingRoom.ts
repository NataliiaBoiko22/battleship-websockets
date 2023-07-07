import { InMemoryDB } from "../database/database";

const db = InMemoryDB.getInstance();

export function findExistingRoom() {
  const rooms = db.getRooms();
  if (rooms.length > 0) {
    return rooms[0].roomId;
  }
  return null;
}
