import { WebSocket } from "ws";

export function sendWebSocketMessage(ws: WebSocket, message: string) {
  ws.send(message, (error) => {
    if (error) {
      console.error("Error sending response:", error);
    }
  });
}
