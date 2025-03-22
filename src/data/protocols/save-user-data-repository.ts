export interface SaveUserDataRepositoryInput {
  name: string;
  ip: string;
  hash: string;
  kills: number;
  deaths: number;
  score: number;
  teamWorkScore: number;
  time?: number; // Tempo de jogo da sessão atual
}

export interface SaveUserDataRepository {
  save: (data: Array<SaveUserDataRepositoryInput>) => Promise<void>;
}
