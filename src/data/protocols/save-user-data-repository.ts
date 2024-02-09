export interface SaveUserDataRepositoryInput {
  name: string;
  ip: string;
  hash: string;
  kills: number;
  deaths: number;
  score: number;
  teamWorkScore: number;
}

export interface SaveUserDataRepository {
  save: (data: Array<SaveUserDataRepositoryInput>) => Promise<void>;
}
