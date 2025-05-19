export interface Clan {
  name: string;
  points: number;
  membersHash: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SaveClanData {
  name: string;
  points: number;
  membersHash?: string[];
}
