
import WebSocket from "ws";
import { Room } from "../database/Room";
import { sendWebSocketMessage } from "./sendWSmessage";

export function handleAttack(ws: WebSocket, data: any, roomInstance: Room) {
  
  if (!roomInstance || roomInstance.checkGameOver()) {
    return;
  } 
  const innerData = JSON.parse(data.data);
  if (!roomInstance) {
    return;
  }

  const currentPlayer =innerData.indexPlayer;
  const inx = innerData.x;
  const iny = innerData.y;
  const attackResult = roomInstance.attack(innerData.indexPlayer, innerData.x, innerData.y);

  const innerDataAttack =  JSON.stringify({
    position: {x: inx, y: iny },
    currentPlayer: currentPlayer,
    status: attackResult.status,
  })
  const attackFeedback = {
    type: "attack",
    data: innerDataAttack,
    id: 0,
  };

  sendWebSocketMessage(ws, JSON.stringify(attackFeedback));

  if (roomInstance.checkGameOver()) {
    const winPlayer = roomInstance.getWinningPlayer();
    const finishGame = {
      type: "finish",
      data: JSON.stringify({
        winPlayer: winPlayer,
      }),
      id: 0,
    };

    roomInstance.broadcastMessage(JSON.stringify(finishGame));
  }
}
