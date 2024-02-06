import { NewPlayerProfileLogEvent } from "../../presentation/events/new-player-profile-log";

export const makeNewPlayerProfileLogEvent = () => {
  const event = new NewPlayerProfileLogEvent();

  return event;
};
