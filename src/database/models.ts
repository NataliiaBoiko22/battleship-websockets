export interface IPlayer {
  name: string;
  password: string;
  wins: number;
}


export interface IPlayerReg {
  name: string;
  index: number;
  error: boolean;
  errorText: string;
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

export interface IUpdateRoomResponse {
  type: string;
  data: string;
  id: number;
}

export interface IUpdateWinnersResponse {
  type: string;
  data: string;
  id: number;
}