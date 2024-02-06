import { server } from "../../main/config/app";
import type { Event } from "../protocols/event";

export class NewPlayerProfileLogEvent implements Event {
  public async handle(data: any): Promise<void> {
    server.emit("newPlayerProfileLog", data);
  }
}
