import { server } from "../../main/config/app";
import type { Event } from "../protocols/event";

export class KillLogEvent implements Event {
  public async handle(data: any): Promise<void> {
    server.emit("kill", data);
  }
}
