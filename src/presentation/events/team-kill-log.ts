import { server } from "../../main/config/app";
import type { Event } from "../protocols/event";

export class TeamKillLogEvent implements Event {
  public async handle(data: any): Promise<void> {
    server.emit("teamKill", data);
  }
}
