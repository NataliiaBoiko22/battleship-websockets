import { Room } from "../database/Room";
import { InMemoryDB, roomInstances } from "../database/database";
import { IUpdateRoomResponse } from "../database/models";
import { sendWebSocketMessage } from "./sendWSmessage";
import { handleUpdateWinners } from "./handleUpdateWinners";
import { updateRoomList } from "../helpers/updateRoomList";
const db = InMemoryDB.getInstance();

export function handleFinishGame(roomInstance: Room, winningPlayer: number | null) {
    const finishGameMessage = JSON.stringify({
    type: "finish",
    data: JSON.stringify({
      winPlayer: winningPlayer !== null ? winningPlayer : null,
    }),
    id: 0,
  });
  roomInstance.broadcastMessage(finishGameMessage);
  db.updatePlayerWins(winningPlayer);

  if (winningPlayer !== null) {
    const roomId = roomInstance.getRoomId();
    if (roomId in roomInstances) {
        if (roomId in roomInstances) {
          delete roomInstances[roomId];
          db.deleteRoom(roomId);
          updateRoomList(); 
        }
        delete roomInstances[roomId];
        const updateRoomResponse: IUpdateRoomResponse = {
          type: "update_room",
          data: JSON.stringify([]),
          id: 0,
        };
        const updateRoomResponseJSON = JSON.stringify(updateRoomResponse);
        roomInstance.getSockets().forEach((socket) => {
          sendWebSocketMessage(socket, updateRoomResponseJSON); 
        });
      }
}
}