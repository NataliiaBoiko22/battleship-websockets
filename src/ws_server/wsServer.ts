import { InMemoryDB } from "../database/database";
import {
  IRegResponse,
  IRegRequest,
  IPlayer,
  IUpdateWinnersResponse,
} from "database/models";
import { Server as WebSocketServer, WebSocket } from "ws";
// import { httpServer } from "http_server";
import { Server as HttpServer } from "http";

const db = new InMemoryDB();
export function startWebSocketServer(httpServer: HttpServer) {
  // const WS_PORT = 8080;
  const wsServer = new WebSocketServer({ server: httpServer });

  wsServer.on("connection", (ws) => {
    console.log("New WebSocket connection");
    ws.on("error", console.error);

    ws.on("message", (message: string) => {
      console.log(`Received message: ${message}`);
      const data = JSON.parse(message);
      const user = JSON.parse(data.data);
      console.log(`After parse: ${JSON.stringify(data)}`);

      if (data.type === "reg") {
        const regRequest: IRegRequest = {
          type: data.type,
          data: JSON.parse(data.data),
          id: data.id,
        };
        console.log(`Request data:${JSON.stringify(regRequest)}`);
        const { name, password } = regRequest.data;
        console.log(`Request data - data:${regRequest.data}`);
        const player: IPlayer = {
          name,
          password,
          wins: 0,
        };
        const index = db.registerPlayer(player);
        console.log(`Index: ${index}`);
        console.log(`Name : ${regRequest.data.name}`);

        const innerData = {
          name: JSON.stringify(user.name),
          index,
          error: false,
          errorText: "error",
        };

        const regResponse: IRegResponse = {
          type: "reg",
          data: JSON.stringify(innerData),
          id: regRequest.id,
        };
        console.log(`Regresponse Stringifi:${JSON.stringify(regResponse)}`);
        const regResponseJSON = JSON.stringify(regResponse);
        console.log(regResponseJSON);

        ws.send(regResponseJSON, (error) => {
          if (error) {
            console.error("Error sending response:", error);
          }
        });
      } else if (data.type === "update_winners") {
        const winners = db.updateWinners();
        const updateWinnersResponse: IUpdateWinnersResponse = {
          type: "update_winners",
          data: winners,
          id: data.id,
        };
        ws.send(JSON.stringify(updateWinnersResponse));
      }

    });

    // ws.on("close", () => {
    //     console.log("WebSocket connection closed");
    //   });
  });

}
