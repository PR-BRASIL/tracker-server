import { Clan, SaveClanData } from "../models/clan";

export interface ClanRepository {
  saveMany(data: SaveClanData[]): Promise<void>;
  findByName(name: string): Promise<Clan | null>;
  findAll(): Promise<Clan[]>;
}
