import { KillLogEvent } from "../../presentation/events/kill-log";

export const makeKillLogEvent = () => {
  const event = new KillLogEvent();

  return event;
};
