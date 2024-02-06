import { ConnectionLogEvent } from "../../presentation/events/connection-log";

export const makeConnectionLogEvent = () => {
  const event = new ConnectionLogEvent();

  return event;
};
