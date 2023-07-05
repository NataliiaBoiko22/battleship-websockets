import { IPlayer } from "./models";

export class InMemoryDB {
  private players: IPlayer[];

  constructor() {
    this.players = [];
  }

  public addPlayer(player: IPlayer) {
    this.players.push(player);
  }

  public getPlayerByUsername(username: string): IPlayer | undefined {
    return this.players.find((player) => player.name === username);
  }
  public registerPlayer(player: IPlayer): number {
    const index = this.players.findIndex((p) => p.name === player.name);
    if (index !== -1) {
      return index;
    }

    this.players.push(player);
    return this.players.length - 1;
  }

  public updateWinners(): IPlayer[] {
    return this.players
      .filter((player) => player.wins > 0)
      .sort((a, b) => b.wins - a.wins);
  }
}
