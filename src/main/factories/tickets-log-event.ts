import { TicketsLogEvent } from "../../presentation/events/tickets-log";

export const makeTicketsLogEvent = () => {
  const event = new TicketsLogEvent();

  return event;
};
