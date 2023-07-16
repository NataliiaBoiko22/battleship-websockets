import WebSocket from "ws";
import { InMemoryDB } from "../database/database";
import { roomInstances } from "../database/database";
import { handleFinishGame } from "../handlers/handleFinishGame";
const db = InMemoryDB.getInstance();
// const roomInstances: Room[] = [];
export class Room {
  private sockets: WebSocket[];
  private roomId: number;
  private gameCounter: number;
  private activePlayerId: number;
  private shipsDataPlayer1: any; 
  private shipsDataPlayer2: any; 
  constructor(roomId: number) {
    this.roomId = roomId;
    this.sockets = [];
    this.gameCounter = 0;
    this.activePlayerId = 0;
    this.shipsDataPlayer1 = [];
    this.shipsDataPlayer2 = [];

  }

  public getRoomId(): number {
    return this.roomId;
  }
  public getSockets(): WebSocket[] {
    return this.sockets;
  }
  public debugShipsData() {
    console.log('Ships Data Player 1:', this.shipsDataPlayer1);
    console.log('Ships Data Player 2:', this.shipsDataPlayer2);
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
    console.log("CLASS ROOM ADD USER this.sockets", this.sockets);
    if (this.sockets.length >= 2) {
      console.log("Room is full. Cannot add more players.");
      return;
    }
    this.sockets.push(socket);

    console.log("socket lenth", this.sockets.length);
    if (this.sockets.length === 2) {
      this.createGame();
    }
  }

  private createGame() {
    const gameId = this.roomId + "_" + this.gameCounter;
    this.gameCounter++;
    this.shipsDataPlayer1 = [];
    this.shipsDataPlayer2 = [];
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

    console.log('I TURN TO', activePlayerIndexInner);
    this.broadcastMessage(JSON.stringify(currentPlayerTurn));
  }

  public setShipsData(playerId: number, ships: any) {
    if (playerId === 0) {
      this.shipsDataPlayer1 = ships;
    } else if (playerId === 1) {
      this.shipsDataPlayer2 = ships;
    }
  }
  public getShipsData(playerId: number): any{
    if (playerId === 0) {
      return this.shipsDataPlayer1;
    } else if (playerId === 1) {
      return this.shipsDataPlayer2;
    }
    return [];
  }
  // AAAAAAAAAAATTTTTTTTTTTTTTTTTAAAAAAAAAAAAAAAAAKKKKKKKKKKKKKKKAAAAAAAAAAAA
  public attack(playerId: number, x: number, y: number): { status: string; shipCoordinates: { x: number; y: number }[], nextPlayer: number } {
   
    const currentPlayerSocket = this.sockets[playerId];
    const opponentId = playerId === 0 ? 1 : 0;
    const opponentSocket = this.sockets[opponentId];
    const shipsData = this.getShipsData(opponentId);
    if (!this.sockets[playerId]) {
      // Комната не существует или указанный игрок не существует
      return { status: '', shipCoordinates: [], nextPlayer: -1 };
    }
    if (this.checkGameOver()) {
      return { status: '', shipCoordinates: [], nextPlayer: -1 }; // Вернуть пустой объект, так как игра завершена
    }
    const formattedData = {
      ownerId: playerId, 
      ships: shipsData.ships.map((shipArr: any[]) => shipArr.map((ship: any) => Object.values(ship)))
    };
    console.log('!!!!!!!!!!!!!DATA SHIPS in ROOM');
    console.log(formattedData.ownerId);
    formattedData.ships.forEach((shipArr: any[][]) => {
      shipArr.forEach((ship: any[]) => {
        console.log(ship);
      });
    }); 
    const hitShipCoordinates: { x: number; y: number }[] = []; 
  
    const hitShip = shipsData.ships.some((ship: any[]) =>
  ship.some((position: any) => position.x === x && position.y === y && position.state === 'alive')
);

if (hitShip) {
  shipsData.ships.forEach((ship: any[], shipIndex: number) => {
    ship.forEach((position: any) => {
      if (position.x === x && position.y === y && position.state === 'alive') {
        position.state = 'hit';
        this.checkShipStatus(opponentId, shipIndex);
      } 
    });
  });

  hitShipCoordinates.push({ x, y });
}
    let status: string;
    if (hitShipCoordinates.length > 0) {
      const areAllShipsDestroyed = shipsData.ships.every((ship: any[]) => ship.every((position: any) => position.state === 'hit'|| position.state === 'killed'));
      status = areAllShipsDestroyed ? 'killed' : 'shot';
      console.log('status', status);
      hitShipCoordinates.push({ x, y });
    } else {
      status = 'miss';
      console.log('status', status);
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

    if (status === 'miss') {
      // this.activePlayerId = opponentId;
      this.switchActivePlayer();
    } else if (status === 'killed' || status === 'shot')  {
      const currentPlayerTurn = {
        type: 'turn',
        data: JSON.stringify({
          currentPlayer: this.activePlayerId,
        }),
        id: 0,
      };
      this.broadcastMessage(JSON.stringify(currentPlayerTurn));
    }
  
    if (this.checkGameOver()) {
      // Game over logic
      const winPlayer = this.getWinningPlayer();
      handleFinishGame(this, winPlayer);
    }
  console.log('attackResult', attackResult);
  console.log('attackResult.shipCoordinates', attackResult.shipCoordinates);

    return attackResult;
  }
public checkShipStatus(playerId: number, shipIndex: number): void {
  const shipsData = this.getShipsData(playerId);
  const ship = shipsData.ships[shipIndex];
  const isShipDestroyed = ship.every((position: any) => position.state === 'hit');

  if (isShipDestroyed) {
    ship.forEach((position: any) => {
      const { x, y } = position;
      const neighboringPositions = [
        { x: x - 1, y: y - 1 },
        { x: x - 1, y },
        { x: x - 1, y: y + 1 },
        { x, y: y - 1 },
        { x, y: y + 1 },
        { x: x + 1, y: y - 1 },
        { x: x + 1, y },
        { x: x + 1, y: y + 1 },
      ];

      neighboringPositions.forEach(((pos: { x: number, y: number }) => {
        const { x: posX, y: posY } = pos;
        const attackResult = {
          status: 'miss',
          shipCoordinates: [],
          nextPlayer: playerId,
        };

        if (
          posX >= 0 &&
          posX < 10 &&
          posY >= 0 &&
          posY < 10 &&
          !ship.some((shipPos: any) => shipPos.x === posX && shipPos.y === posY)
        ) {
          const opponentId = playerId === 0 ? 1 : 0;
          this.sockets[opponentId].send(
            JSON.stringify({
              type: 'attack',
              data: JSON.stringify({
                position: { x: posX, y: posY },
                currentPlayer: opponentId,
                status: attackResult.status,
              }),
              id: 0,
            })
          );
        }
      }))
    });

    if (this.checkGameOver()) {

      console.log("IF CHECKGAMEOVER TRUE");
      const winningPlayer = this.getWinningPlayer();
          this.finishGame(winningPlayer);
            const winners = db.updateWinners();
            console.log('winners FROM room. if (this.checkGameOver())', winners);
            console.log('winners FROM room. if (this.checkGameOver())', winners[0]);

            this.updateWinners(winners);
    }
    }

  }



public checkGameOver(): boolean {
  const shipsDataPlayer1 = this.getShipsData(0);
  const shipsDataPlayer2 = this.getShipsData(1);

  const isPlayer1Defeated = shipsDataPlayer1?.ships?.every((ship: any[]) =>
    ship.every((position: any) => position.state === 'hit')
  ) || false;
  const isPlayer2Defeated = shipsDataPlayer2?.ships?.every((ship: any[]) =>
    ship.every((position: any) => position.state === 'hit')
  ) || false;

  return isPlayer1Defeated || isPlayer2Defeated;
}


  
  public getWinningPlayer(): number | null {
    const shipsDataPlayer1 = this.getShipsData(0);
    const shipsDataPlayer2 = this.getShipsData(1);
  
    const isPlayer1Defeated =
    shipsDataPlayer1?.ships?.length > 0 &&
    shipsDataPlayer1.ships.every((ship: any[]) =>
      ship.every((position: any) => position.state === 'hit')
    );

  const isPlayer2Defeated =
    shipsDataPlayer2?.ships?.length > 0 &&
    shipsDataPlayer2.ships.every((ship: any[]) =>
      ship.every((position: any) => position.state === 'hit')
    );
  
     if (isPlayer1Defeated) {
      return 1; 
    } else if (isPlayer2Defeated) {
      return 0; 
    } else {
      return null; 
    }
  }

  public updateWinners(winners: { name: string; wins: number }[]) {
    const updateWinnersMessage = JSON.stringify({
      type: "update_winners",
      data: JSON.stringify(winners),
      id: 0,
    });
    console.log('RRRRRRRRRupdateWinnersMessage', updateWinnersMessage );
    this.broadcastMessage(updateWinnersMessage);
  }
  
  public finishGame(winningPlayer: number | null) {
    const finishGameMessage = JSON.stringify({
      type: "finish",
      data: JSON.stringify({
        winPlayer: winningPlayer !== null ? winningPlayer : null,
      }),
      id: 0,
    });
    if (winningPlayer !== null) {
      db.updatePlayerWins(winningPlayer);
    }
    this.broadcastMessage(finishGameMessage);
  }

}
