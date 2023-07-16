
import WebSocket from "ws";
import { Room } from "../database/Room";
import { sendWebSocketMessage } from "./sendWSmessage";

export function handleAttack(ws: WebSocket, data: any, roomInstance: Room) {
  
  if (!roomInstance || roomInstance.checkGameOver()) {
    // Если игра уже завершена, просто возвращаемся из обработчика
    return;
  } 
  const innerData = JSON.parse(data.data);
console.log('DATA NANDLEATTACK', innerData);
  if (!roomInstance) {
    return;
  }

  const currentPlayer =innerData.indexPlayer;
  const inx = innerData.x;
  const iny = innerData.y;
  console.log('currentPlayer', currentPlayer);
  console.log('x', inx);
console.log('y', iny);

  const attackResult = roomInstance.attack(innerData.indexPlayer, innerData.x, innerData.y);

  console.log('attackResult from handleAttack', attackResult);
  console.log('attackResult.shipCoordinates', attackResult.shipCoordinates[0]);
  
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

  console.log('attackFeedback', JSON.stringify(attackFeedback));
  sendWebSocketMessage(ws, JSON.stringify(attackFeedback));

  if (roomInstance.checkGameOver()) {
    // Check if the game is over
    const winPlayer = roomInstance.getWinningPlayer();
    const finishGame = {
      type: "finish",
      data: JSON.stringify({
        winPlayer: winPlayer,
      }),
      id: 0,
    };

    // Send the game over message to all connected sockets in the room
    roomInstance.broadcastMessage(JSON.stringify(finishGame));
  }
}
