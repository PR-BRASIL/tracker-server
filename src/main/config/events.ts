import type { Server, Socket } from "socket.io";

export const makeEvents = (server: Server) => {
  server.on("connection", async (socket: Socket) => {
    console.log(socket.id);

    socket.on("banLog", async (data: any) => {
      server.emit("banLog", data);
    });

    socket.on("chatLog", async (data: any) => {
      server.emit("chat", data);
    });

    socket.on("gameLog", async (data: any) => {
      server.emit("gameLog", data);
    });

    socket.on("newPlayerProfileLog", async (data: any) => {
      server.emit("newPlayerProfileLog", data);
    });

    socket.on("reportLog", async (data: any) => {
      server.emit("reportLog", data);
    });

    socket.on("adminLog", async (data: any) => {
      server.emit("adminLog", data);
    });

    socket.on("ticketsLog", async (data: any) => {
      server.emit("ticketsLog", data);
    });

    socket.on("kill", async (data: any) => {
      server.emit("kill", data);
    });

    socket.on("teamKill", async (data: any) => {
      server.emit("teamKill", data);
    });

    socket.on("connectionLog", async (data: any) => {
      server.emit("connectionLog", data);
    });

    socket.on("gameState", (data: any) => {
      server.emit("gameState", data);
    });
  });
};
