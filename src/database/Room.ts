import WebSocket from "ws";

export class Room {
  private sockets: WebSocket[];
  private roomId: number;
  private gameCounter: number;
  private activePlayerId: number;
  private shipsData: any; 

  constructor(roomId: number) {
    this.roomId = roomId;
    this.sockets = [];
    this.gameCounter = 0;
    this.activePlayerId = 0;
    this.shipsData = null;
  }


  public broadcastMessage(message: string) {
    this.sockets.forEach((socket) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(message);
      }
    });
  }

  public addUser(socket: WebSocket) {
    console.log("CLASS ROOM ADD USER");
    this.sockets.push(socket);

    console.log("socket lenth", this.sockets.length);
    if (this.sockets.length === 2) {
      this.createGame();
    }
  }

  private createGame() {
    const gameId = this.roomId + "_" + this.gameCounter;
    this.gameCounter++;
    this.shipsData = {}; 
  // this.broadcastMessage(JSON.stringify({ type: "start_game" }));
    this.sockets.forEach((socket, index) => {
      const playerId = index;
      const inData = {
        idGame: gameId,
        idPlayer: playerId,
      };
      const innerData = JSON.stringify(inData);
      const createGameResponse = {
        type: "create_game",
        data: innerData,
        id: 0,
      };
      socket.send(JSON.stringify(createGameResponse));
    });
  }

  public switchActivePlayer() {
    this.activePlayerId = this.activePlayerId === 0 ? 1 : 0;
    const activePlayerIndexInner = JSON.stringify({
        currentPlayer: this.activePlayerId,
      })
    const currentPlayerTurn = {
      type: "turn",
      data: activePlayerIndexInner,
      id: 0,
    };
    this.broadcastMessage(JSON.stringify(currentPlayerTurn));
  }

  public setShipsData(ships: any) {
    this.shipsData = ships;
  }
  public attack(playerId: number, x: number, y: number): { status: string; shipCoordinates: { x: number; y: number }[], nextPlayer: number } {
    const currentPlayerSocket = this.sockets[playerId];
    const opponentId = playerId === 0 ? 1 : 0;
    const opponentSocket = this.sockets[opponentId];
    const shipsData = this.shipsData;
    
    console.log('SHIIPS',shipsData);
    // Assuming you have access to the ships' data
    const hitShipCoordinates: { x: number; y: number }[] = []; 
  
    shipsData.ships.forEach((ship: any) => {
      const isHit = ship.some((position: any) => position.x === x && position.y === y && position.state === 'alive');
      if (isHit) {
        hitShipCoordinates.push({ x, y });
        console.log('hitShipCoordinates', hitShipCoordinates);
      }
    });
  
    let status: string;
    if (hitShipCoordinates.length > 0) {
      // Check if the ship is killed or just hit
      const isShipKilled = shipsData.ships.every((ship: any) => ship.every((position: any) => position.state === 'hit'));
      status = isShipKilled ? 'killed' : 'shot';
      console.log('status', status);
    } else {
      status = 'miss';
      hitShipCoordinates.push({ x, y });
    }
  
    // Prepare the attack result to send to the current player
    const attackResult = {
      status,
      shipCoordinates: hitShipCoordinates,
      nextPlayer: opponentId,
    };
  
    // Send the attack result to the current player
    currentPlayerSocket.send(JSON.stringify({
      type: 'attack',
      data: JSON.stringify({
        position: { x, y },
        currentPlayer: playerId,
        status: attackResult.status,
      }),
      id: 0,
    }));
  
    // Send the attack result to the opponent
    opponentSocket.send(JSON.stringify({
      type: 'attack',
      data: JSON.stringify({
        position: { x, y },
        currentPlayer: playerId,
        status: attackResult.status,
      }),
      id: 0,
    }));
  
    // Switch the active player
    this.activePlayerId = opponentId;
    this.switchActivePlayer();
  
    if (this.checkGameOver()) {
      // Game over logic
      const winPlayer = this.getWinningPlayer();
      const finishGame = {
        type: 'finish',
        data: {
          winPlayer,
        },
        id: 0,
      };
      // Broadcast the finish game message to both players
      this.broadcastMessage(JSON.stringify(finishGame));
    }
  console.log('attackResult', attackResult);
  console.log('attackResult.shipCoordinates', attackResult.shipCoordinates);

    return attackResult;
  }


  public checkGameOver(): boolean {
   
    return false;
  }
  public getWinningPlayer(): number | null {
   
    return null;
  }
}
