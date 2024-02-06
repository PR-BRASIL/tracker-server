import { server } from "../../main/config/app";
import type { Event } from "../protocols/event";

export class AdminLogEvent implements Event {
  public async handle(data: any): Promise<void> {
    server.emit("adminLog", data);
  }
}
