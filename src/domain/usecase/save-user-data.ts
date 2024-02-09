export interface SaveUserDataInput {
  name: string;
  ip: string;
  hash: string;
  kills: number;
  deaths: number;
  score: number;
  teamWorkScore: number;
}

export interface SaveUserData {
  save: (data: Array<SaveUserDataInput>) => Promise<void>;
}
