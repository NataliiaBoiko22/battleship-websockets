import { Room } from "../database/Room";
import { InMemoryDB, roomInstances } from "../database/database";
import { IUpdateRoomResponse } from "../database/models";
import { sendWebSocketMessage } from "./sendWSmessage";
import { handleUpdateWinners } from "./handleUpdateWinners";
const db = InMemoryDB.getInstance();

export function handleFinishGame(roomInstance: Room, winningPlayer: number | null) {

    console.log('HandleFinishGame winningPlayer', winningPlayer);
    const finishGameMessage = JSON.stringify({
    type: "finish",
    data: JSON.stringify({
      winPlayer: winningPlayer !== null ? winningPlayer : null,
    }),
    id: 0,
  });
  roomInstance.broadcastMessage(finishGameMessage);
  db.updatePlayerWins(winningPlayer);

  // if (winningPlayer !== null) {
  //   console.log('handleUpdateWinners from handleFINISHgame');
  //   handleUpdateWinners(roomInstance.getSockets()[0], {});
  // }
//   if (winningPlayer !== null) {
    // Удаление комнаты из roomInstances

    const roomId = roomInstance.getRoomId();
    console.log('!!!!!!!!!!!!!!!!roomId', roomId);
    console.log('!!!!!!!!!!!!!!roomInstances', roomInstances);
    if (roomId in roomInstances) {
        console.log('roomInstances 44444444', roomInstances[roomId]);

        console.log('ROOOM  ID', roomId );
        delete roomInstances[roomId];
        console.log('!!!!!!!!!!!!!!roomInstances', roomInstances);
        // }
        const emptyRoomList: {} = {};
        const updateRoomResponse: IUpdateRoomResponse = {
          type: "update_room",
          data: JSON.stringify(emptyRoomList),
          id: 0,
        };
        const updateRoomResponseJSON = JSON.stringify(updateRoomResponse);
        roomInstance.getSockets().forEach((socket) => {
          sendWebSocketMessage(socket, updateRoomResponseJSON); // Изменение №3
        });
      }
}
