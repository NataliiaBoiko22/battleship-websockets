export interface IPlayer {
  id: number;
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

// export interface IUpdateWinnersResponse {
//   type: "update_winners";
//   data: IPlayer[];
//   id: number;
// }

// export interface IUpdateRoomResponse
// {

//   type: string;
//   data: {
//     roomId: number;
//     roomUsers: {
//       name: string;
//       index: number;
//     }[];
//   }[];
//   id: number;
// }
export interface IUpdateRoomResponse {
  type: string;
  data: string;
  id: number;
}

export interface IUpdateWinnersResponse {
  type: "update_winners";
  data: string;
  id: number;
}