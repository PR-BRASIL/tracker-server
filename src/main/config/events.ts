import type { Server, Socket } from "socket.io";
import { socketClient } from "./socket-client";

export const makeEvents = (server: Server) => {
  server.on("connection", async (socket: Socket) => {
    socket.on("banLog", async (data: any) => {
      socketClient.emit("banLog", data);
    });

    socket.on("chatLog", async (data: any) => {
      socketClient.emit("chatLog", data);
    });

    socket.on("gameLog", async (data: any) => {
      socketClient.emit("gameLog", data);
    });

    socket.on("newPlayerProfileLog", async (data: any) => {
      socketClient.emit("newPlayerProfileLog", data);
    });

    socket.on("reportLog", async (data: any) => {
      socketClient.emit("reportLog", data);
    });

    socket.on("adminLog", async (data: any) => {
      socketClient.emit("adminLog", data);
    });

    socket.on("ticketsLog", async (data: any) => {
      socketClient.emit("ticketsLog", data);
    });
  });
};
