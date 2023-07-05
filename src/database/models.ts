export interface IPlayer {
  name: string;
  password: string;
  wins: number;
}

export interface IRegRequest {
  type: "reg";
  data: {
    name: string;
    password: string;
  };
  id: number;
}

export interface IRegResponse {
  type: "reg";
  data: string;
  id: number;
}

export interface IUpdateWinnersResponse {
  type: "update_winners";
  data: IPlayer[];
  id: number;
}
