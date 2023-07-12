import { IPlayer } from "./models";

export class InMemoryDB {
  private static instance: InMemoryDB; 

  private players: IPlayer[];
  private rooms: {
    roomId: number;
    roomUsers: { name: string; index: number }[];
  }[];
  constructor() {
    this.players = [];
    this.rooms = [];
  }

  public static getInstance(): InMemoryDB {
    if (!InMemoryDB.instance) {
      InMemoryDB.instance = new InMemoryDB();
    }
    return InMemoryDB.instance;
  }

  public getPlayers(): void {
    console.log("All players form BD", this.players);
  }
  public createId(): number {
    const allIds = this.players.map((player) => player.id);
    return allIds.length > 0 ? Math.max(...allIds) + 1 : 1;
  }
  public getById(id: number): IPlayer | undefined {
    return this.players.find((user) => user.id === id);
  };
  public getUserName(index: number): string {
    const player = this.players[index];
    return player ? player.name : "";
  }

  public addPlayer(player: IPlayer) {
    this.players.push(player);
  }

  public getPlayerByUsername(username: string): IPlayer {
    const player = this.players.find((player) => player.name === username);
    if (player) {
      return player;
    } else {
      throw new Error("Player not found");
    }
  }
  public getPlayerIndexByUsername(username: string): number {
    const playerIndex = this.players.findIndex(
      (player) => player.name === username
    );
    return playerIndex !== -1 ? playerIndex : 0;
  }
  public getIndexRegisterPlayer(player: IPlayer): number {
    const index = this.players.findIndex((p) => p.name === player.name);
    if (index !== -1) {
      return index;
    }

    return this.players.length - 1;
  }
  public registerPlayer(player: IPlayer) {
    return this.players.push(player);
  }

  public updateWinners(): IPlayer[] {
    return this.players
      .filter((player) => player.wins > 0)
      .sort((a, b) => b.wins - a.wins);
  }

  public createRoom(): number {
    const roomId = this.rooms.length + 1;
    const room = {
      roomId,
      roomUsers: [],
    };
    this.rooms.push(room);
    return roomId;
  }

  public addPlayerToRoom(roomId: number, name: string) {
    const roomIndex = this.rooms.findIndex((r) => r.roomId === roomId);
    if (roomIndex === -1) {
      throw new Error("Room not found");
    }

    const room = this.rooms[roomIndex];
    const index = room.roomUsers.length;
    const user = {
      name,
      index,
    };
    room.roomUsers.push(user);
    return index;
  }

  public getRooms(): {
    roomId: number;
    roomUsers: { name: string; index: number }[];
  }[] {
    console.dir(this.rooms, { depth: null });
    return this.rooms;
  }

  public updateRoom(): any {
    const updatedRooms = this.rooms.map((room) => ({
      roomId: room.roomId,
      roomUsers: room.roomUsers.map((user) => ({
        name: user.name,
        index: user.index,
      })),
    }));

    this.rooms = updatedRooms;
    return updatedRooms;
  }

  getIndexRoom(): number {
    return this.rooms.length;
  }
}

import { Room } from "./Room";

export const roomInstances: Record<number, Room> = {};
