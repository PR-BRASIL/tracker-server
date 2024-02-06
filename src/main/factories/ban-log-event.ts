import { BanLogEvent } from "../../presentation/events/ban-log";

export const makeBanLogEvent = () => {
  const event = new BanLogEvent();

  return event;
};
