import { DbSaveUserData } from "../../data/usecase/save-user-data";
import { MongoSaveUserDataRepository } from "../../infra/db/mongodb/repositories/save-user-data-repository";
import { GameLogEvent } from "../../presentation/events/game-log";

export const makeGameLogEvent = () => {
  const mongoSaveUserDataRepository = new MongoSaveUserDataRepository();
  const dbSaveUserData = new DbSaveUserData(mongoSaveUserDataRepository);
  const event = new GameLogEvent(dbSaveUserData);

  return event;
};
