import type {
  SaveUserDataRepository,
  SaveUserDataRepositoryInput,
} from "../../../../data/protocols/save-user-data-repository";
import { mongoHelper } from "../helpers/mongo-helper";
import type { Collection } from "mongodb";

export class MongoSaveUserDataRepository implements SaveUserDataRepository {
  public async save(
    data: Array<SaveUserDataRepositoryInput>,
    path: string
  ): Promise<void> {
    const pathCollection = await mongoHelper.getCollection("path");

    const pathExists = await pathCollection.findOne({
      path,
    });

    if (pathExists) {
      return;
    }

    await pathCollection.insertOne({
      path,
    });

    const collectionUserTemp = await mongoHelper.getCollection("monthly_user");
    const collectionUser = await mongoHelper.getCollection("user");

    for (const d of data) {
      await this.updateUser(d, collectionUserTemp);
      await this.updateUser(d, collectionUser);
    }
  }

  private async updateUser(
    d: SaveUserDataRepositoryInput,
    collection: Collection
  ): Promise<void> {
    const existsUserByHash = await collection.findOne({
      hash: d.hash,
    });

    if (!existsUserByHash) {
      const data = {
        ...d,
        rounds: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await collection.insertOne(data);
    } else {
      const data = {
        $set: {
          name: d.name,
          updatedAt: new Date(),
        },
        $inc: {
          score: d.score,
          kills: d.kills,
          deaths: d.deaths,
          teamWorkScore: d.teamWorkScore,
          rounds: 1,
        },
      };

      await collection.updateOne(
        {
          hash: d.hash,
        },
        data
      );
    }
  }
}
