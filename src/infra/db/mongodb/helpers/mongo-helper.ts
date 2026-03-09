import type { Collection } from "mongodb";
import { MongoClient } from "mongodb";
import { env } from "../../../../main/config/env";

export const mongoHelper = {
  client: null as MongoClient,
  async connect(url?: string): Promise<void> {
    this.client = await new MongoClient(url || env.mongoUrl).connect();

    try {
      const db = this.client.db();
      // Cria índices para as coleções user e monthly_user para otimizar busca e ordenação
      await db.collection("user").createIndex({ hash: 1 }, { background: true });
      await db.collection("user").createIndex({ score: -1 }, { background: true });
      await db.collection("user").createIndex({ name: 1 }, { background: true });

      await db.collection("monthly_user").createIndex({ hash: 1 }, { background: true });
      await db.collection("monthly_user").createIndex({ score: -1 }, { background: true });
      await db.collection("monthly_user").createIndex({ name: 1 }, { background: true });
    } catch (e) {
      console.warn("Aviso ao criar índices no MongoDB:", e);
    }
  },

  async disconnect(): Promise<void> {
    await this.client.close();
    this.client = null;
  },

  dbCollection(): Collection {
    return;
  },

  async getCollection(name: string): Promise<Collection> {
    try {
      return this.client.db().collection(name);
    } catch {
      await this.connect();
      return this.client.db().collection(name);
    }
  },

  // eslint-disable-next-line
  map(account: any): any {
    try {
      const { _id, ...accountWithoudId } = account;

      return {
        ...accountWithoudId,
        id: _id.toString(),
      };
    } catch {
      return null;
    }
  },
};
