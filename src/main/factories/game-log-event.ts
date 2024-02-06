import { GameLogEvent } from "../../presentation/events/game-log";

export const makeGameLogEvent = () => {
  const event = new GameLogEvent();

  return event;
};
