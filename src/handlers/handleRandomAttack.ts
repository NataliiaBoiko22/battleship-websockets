import WebSocket from "ws";
import { Room } from "../database/Room";

 export function handleRandomAttack(ws: WebSocket, data: any, roomInstance: Room) {
    const innerData = JSON.parse(data.data);
    const gameId = innerData.gameId;
    const indexPlayer = innerData.indexPlayer;
    const randomAttack = generateRandomAttack(gameId, indexPlayer);
    const attackResult = roomInstance.attack(randomAttack.playerId, randomAttack.x, randomAttack.y);
  
    const attackResponse = {
      type: "attack",
      data: JSON.stringify({
        position: { x: randomAttack.x, y: randomAttack.y },
        currentPlayer: randomAttack.playerId,
        status: attackResult.status,
      }),
      id: 0,
    };
  
    roomInstance.broadcastMessage(JSON.stringify(attackResponse));
  }
  
  function generateRandomAttack(gameId: number, indexPlayer: number): { gameId: number; playerId: number; x: number; y: number } {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);

    return {
      gameId,
      playerId: indexPlayer,
      x,
      y,
    };
  }
  