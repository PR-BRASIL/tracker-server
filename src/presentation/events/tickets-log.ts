import { server } from "../../main/config/app";
import type { Event } from "../protocols/event";

export class TicketsLogEvent implements Event {
  public async handle(data: any): Promise<void> {
    server.emit("ticketsLog", data);
  }
}
