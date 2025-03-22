import type {
  SaveUserDataRepository,
  SaveUserDataRepositoryInput,
} from "../../../../data/protocols/save-user-data-repository";
import { mongoHelper } from "../helpers/mongo-helper";

export class MongoSaveUserDataRepository implements SaveUserDataRepository {
  public async save(data: Array<SaveUserDataRepositoryInput>): Promise<void> {
    const collection = await mongoHelper.getCollection("user");

    for (const d of data) {
      const existsUserByHash = await collection.findOne({
        hash: d.hash,
      });

      if (!existsUserByHash) {
        await collection.insertOne(d);
      } else {
        await collection.updateOne(
          {
            hash: d.hash,
          },
          {
            $set: {
              name: d.name,
            },
            $inc: {
              score: d.score,
              kills: d.kills,
              deaths: d.deaths,
              teamWorkScore: d.teamWorkScore,
              // totalTime: d.time || 0,
            },
          }
        );
      }
    }
  }
}
