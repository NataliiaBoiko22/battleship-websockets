import { IPlayer } from "./models";

export class InMemoryDB {
  private static instance: InMemoryDB; // Статическое поле для хранения экземпляра

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
  public getUserName(index: number): string {
    const player = this.players[index];
    console.log("this.players form getUserName", this.players);
    console.log("dddddddddd", player);
    return player ? player.name : "";
  }

  public addPlayer(player: IPlayer) {
    this.players.push(player);
  }
  // public getUsername(index: string): IPlayer | undefined {
  // return this.players.find((player) => player.name === username);
  // }
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

    // this.players.push(player);
    // console.log("this.players from registerPlayer", this.players);
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
    console.log("THISROOM", room);
    return roomId;
  }

  public addPlayerToRoom(roomId: number, name: string) {
    const roomIndex = this.rooms.findIndex((r) => r.roomId === roomId);
    if (roomIndex === -1) {
      throw new Error("Room not found");
    }

    const room = this.rooms[roomIndex];
    console.log("room FromThisRoom", room);
    const index = room.roomUsers.length;
    console.log("index from addPlayerToRoom", index);
    const user = {
      name,
      index,
    };
    room.roomUsers.push(user);
    console.log("user from addPlayerToRoom", user);
    console.log("room", room);
    return index;
  }

  public getRooms(): {
    roomId: number;
    roomUsers: { name: string; index: number }[];
  }[] {
    console.log("GETROOMS::");
    console.dir(this.rooms, { depth: null });
    return this.rooms;
  }

  public updateRoom(): any {
    console.log("this.rooms from updateRoom", this.rooms);
    const updatedRooms = this.rooms.map((room) => ({
      roomId: room.roomId,
      roomUsers: room.roomUsers.map((user) => ({
        name: user.name,
        index: user.index,
      })),
    }));

    // const updateData = {
    //   type: "update_room",
    //   data: updatedRooms,
    //   id: 0,
    // };

    // console.log("updateData", updateData);
    this.rooms = updatedRooms;
    console.log("updatedRoom", updatedRooms);
    return updatedRooms;
  }

  getIndexRoom(): number {
    return this.rooms.length;
  }
}

import { Room } from "../handlers/Room";

export const roomInstances: Record<number, Room> = {};
