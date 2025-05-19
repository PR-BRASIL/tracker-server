import { Collection } from "mongodb";
import { mongoHelper } from "../db/mongodb/helpers/mongo-helper";
import { Clan, SaveClanData } from "../../data/models/clan";
import { ClanRepository } from "../../data/protocols/clan-repository";

export class MongoDbClanRepository implements ClanRepository {
  private async getCollection(): Promise<Collection> {
    return await mongoHelper.getCollection("clan");
  }

  async saveMany(data: SaveClanData[]): Promise<void> {
    const collection = await this.getCollection();
    const now = new Date();

    const clanData = data.map((clan) => ({
      ...clan,
      createdAt: now,
      updatedAt: now,
    }));

    await collection.insertMany(clanData);
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
}
