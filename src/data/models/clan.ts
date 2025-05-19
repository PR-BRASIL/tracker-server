export interface Clan {
  name: string;
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SaveClanData {
  name: string;
  points: number;
}
