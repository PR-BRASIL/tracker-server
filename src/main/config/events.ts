import { Server, Socket } from "socket.io";

export const makeEvents = (server: Server) => {
  server.on("connection", async (socket: Socket) => {
    socket.on("banLog", async (data: any) => {
      console.log(data);
    });

    socket.on("chatLog", async (data: any) => {
      console.log(data);
    });

    socket.on("gameLog", async (data: any) => {
      console.log(data);
    });

    socket.on("newPlayerProfileLog", async (data: any) => {
      console.log(data);
    });

    socket.on("reportLog", async (data: any) => {
      console.log(data);
    });

    socket.on("adminLog", async (data: any) => {
      console.log(data);
    });

    socket.on("ticketsLog", async (data: any) => {
      console.log(data);
    });
  });
};
