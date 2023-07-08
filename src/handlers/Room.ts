import WebSocket from "ws";

export class Room {
  private sockets: WebSocket[];
  private roomId: number;

  constructor(roomId: number) {
    this.roomId = roomId;
    this.sockets = [];
  }

  public addUser(socket: WebSocket) {
    console.log("CLASS ROOM ADD USER");
    this.sockets.push(socket);

    console.log("socket lenth", this.sockets.length);
    if (this.sockets.length === 2) {
      //   this.notifyPlayer(socket, "You have created the room");
      // } else if (this.sockets.length === 2) {
      //   this.notifyPlayer(socket, "You have joined the room");
      this.startGame();
    }
  }

  private notifyPlayer(socket: WebSocket, message: string) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    }
  }

  private startGame() {
    const idGame = this.roomId;
    const idPlayers = this.sockets.map((socket, index) => index);
    const inData = {
      idGame: idGame,
      idPlayer: idPlayers,
    };
    const innerData = JSON.stringify(inData);
    const createGameResponse = {
      type: "create_game",
      data: innerData,
      id: 0,
    };

    this.sockets.forEach((socket) => {
      // if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(createGameResponse));
      // }
    });
  }
}
