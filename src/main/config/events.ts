import type { Server, Socket } from "socket.io";
import { logger } from "../../utils/logger";
import { makeBanLogEvent } from "../factories/ban-log-event";
import { makeChatLogEvent } from "../factories/chat-log-event";
import { makeGameLogEvent } from "../factories/game-log-event";
import { makeNewPlayerProfileLogEvent } from "../factories/new-player-profile-log-event";
import { makeReportLogEvent } from "../factories/report-log-event";
import { makeAdminLogEvent } from "../factories/admin-log-event";
import { makeTicketsLogEvent } from "../factories/tickets-log-event";
import { makeKillLogEvent } from "../factories/kill-log-event";
import { makeTeamKillLogEvent } from "../factories/team-kill-log-event";
import { makeConnectionLogEvent } from "../factories/connection-log-event";
import { makeGameStateLogEvent } from "../factories/game-state-log-event";

export const makeEvents = (server: Server) => {
  server.on("connection", async (socket: Socket) => {
    logger.debug(socket.id, "Socket Id");

    socket.on("banLog", async (data: any) => makeBanLogEvent().handle(data));

    socket.on("chatLog", async (data: any) => makeChatLogEvent().handle(data));

    socket.on("gameLog", async (data: any) => makeGameLogEvent().handle(data));

    socket.on("newPlayerProfileLog", async (data: any) =>
      makeNewPlayerProfileLogEvent().handle(data)
    );

    socket.on("reportLog", async (data: any) =>
      makeReportLogEvent().handle(data)
    );

    socket.on("adminLog", async (data: any) =>
      makeAdminLogEvent().handle(data)
    );

    socket.on("ticketsLog", async (data: any) =>
      makeTicketsLogEvent().handle(data)
    );

    socket.on("kill", async (data: any) => makeKillLogEvent().handle(data));

    socket.on("teamKill", async (data: any) =>
      makeTeamKillLogEvent().handle(data)
    );

    socket.on("connectionLog", async (data: any) =>
      makeConnectionLogEvent().handle(data)
    );

    socket.on("gameState", (data: any) => makeGameStateLogEvent().handle(data));
  });
};
