import { Collection } from "mongodb";
import { mongoHelper } from "../helpers/mongo-helper";
import { Clan, SaveClanData } from "../../../../data/models/clan";
import { ClanRepository } from "../../../../data/protocols/clan-repository";

export class MongoDbClanRepository implements ClanRepository {
  private async getCollection(): Promise<Collection> {
    return await mongoHelper.getCollection("clan");
  }

  async saveMany(data: SaveClanData[]): Promise<void> {
    if (!data.length) return;

    const collection = await this.getCollection();
    const now = new Date();

    for (const clanData of data) {
      const existingClan = await collection.findOne({ name: clanData.name });

      if (existingClan) {
        // Update existing clan
        const updateData: any = {
          $inc: { points: clanData.points },
          $set: { updatedAt: now },
        };

        // If membersHash exists, add to array avoiding duplicates
        if (clanData.membersHash && clanData.membersHash.length > 0) {
          updateData.$addToSet = {
            membersHash: { $each: clanData.membersHash },
          };
        }

        await collection.updateOne({ name: clanData.name }, updateData);
      } else {
        // Create new clan
        await collection.insertOne({
          name: clanData.name,
          points: clanData.points,
          membersHash: clanData.membersHash || [],
          createdAt: now,
          updatedAt: now,
        });
      }
    }
  }

  async findByName(name: string): Promise<Clan | null> {
    const collection = await this.getCollection();
    const clan = await collection.findOne({ name });
    return clan ? mongoHelper.map(clan) : null;
  }

  async findAll(): Promise<Clan[]> {
    const collection = await this.getCollection();
    const clans = await collection.find().toArray();
    return clans.map((clan) => mongoHelper.map(clan));
  }

  async removeHashFromClan(
    hash: string,
    exceptClanName?: string
  ): Promise<void> {
    const collection = await this.getCollection();

    const query = exceptClanName ? { name: { $ne: exceptClanName } } : {};

    await collection.updateMany(query, { $pull: { membersHash: hash } as any });
  }
}
