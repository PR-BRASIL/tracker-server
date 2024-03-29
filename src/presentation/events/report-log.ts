import { io } from "../../main/config/app";
import type { Event } from "../protocols/event";

export class ReportLogEvent implements Event {
  public async handle(data: any): Promise<void> {
    io.emit("reportLog", data);
  }
}
