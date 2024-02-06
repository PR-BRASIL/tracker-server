import { GameStateLogEvent } from "../../presentation/events/game-state-log";

export const makeGameStateLogEvent = () => {
  const event = new GameStateLogEvent();

  return event;
};
