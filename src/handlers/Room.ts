import WebSocket from "ws";

export class Room {
  private sockets: WebSocket[];
  private roomId: number;
  private gameCounter: number;
  constructor(roomId: number) {
    this.roomId = roomId;
    this.sockets = [];
    this.gameCounter = 0;
  }

  public addUser(socket: WebSocket) {
    console.log("CLASS ROOM ADD USER");
    this.sockets.push(socket);

    console.log("socket lenth", this.sockets.length);
    if (this.sockets.length === 2) {
      //   this.notifyPlayer(socket, "You have created the room");
      // } else if (this.sockets.length === 2) {
      //   this.notifyPlayer(socket, "You have joined the room");
      this.createGame();
    }
  }

  private notifyPlayer(socket: WebSocket, message: string) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    }
  }

  private createGame() {
    const gameId = this.roomId + "_" + this.gameCounter;
    this.gameCounter++;
    this.sockets.forEach((socket, index) => {
      const playerId = index;
      console.log("idPlayers FROM ROOOM", playerId);
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
    // const idPlayers = this.sockets.map((socket, index) => index);

    // console.log("idPlayers FROM ROOOM", idPlayers);

    // const inData = {
    //   idGame: idGame,
    //   idPlayer: idPlayers,
    // };
    // const innerData = JSON.stringify(inData);
    // const createGameResponse = {
    //   type: "create_game",
    //   data: innerData,
    //   id: 0,
    // };

    // this.sockets.forEach((socket) => {
    //   // if (socket.readyState === WebSocket.OPEN) {
    //   socket.send(JSON.stringify(createGameResponse));
    //   // }
    // });
  }
}
