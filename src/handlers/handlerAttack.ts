
import WebSocket from "ws";
import { Room } from "../database/Room";
import { sendWebSocketMessage } from "./sendWSmessage";

export function handleAttack(ws: WebSocket, data: any, roomInstance: Room) {
  
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

  const attackResult = roomInstance.attack(currentPlayer, inx, iny);

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
  // sendWebSocketMessage(ws, JSON.stringify(attackFeedback));

  if (attackResult.status === "killed") {
    // If a ship was destroyed, send messages for hits around the ship
    const shipCoordinates = attackResult.shipCoordinates;
    const shipCoordinatesFeedback = shipCoordinates?.map((coord) => ({
      type: "attack",
      data: JSON.stringify({
        position: coord,
        currentPlayer: currentPlayer,
        status: "miss",
      }),
      id: 0,
    })) || [];

    shipCoordinatesFeedback.forEach((feedback) => {
      sendWebSocketMessage(ws, JSON.stringify(feedback));
    });

    // Continue the turn of the current player
    const currentPlayerTurn = {
      type: "turn",
      data: JSON.stringify({
        currentPlayer: currentPlayer,
      }),
      id: 0,
    };

    sendWebSocketMessage(ws, JSON.stringify(currentPlayerTurn));
  } else {
    // Continue the turn of the next player
    const nextPlayerTurn = {
      type: "turn",
      data: JSON.stringify({
        currentPlayer: attackResult.nextPlayer,
      }),
      id: 0,
    };

    // Send the turn notification to all connected sockets in the room
    roomInstance.broadcastMessage(JSON.stringify(nextPlayerTurn));
  }

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
