export interface SaveUserDataInput {
  name: string;
  ip: string;
  hash: string;
  kills: number;
  deaths: number;
  score: number;
  teamWorkScore: number;
  time?: number; // Tempo de jogo da sessão atual
}

export interface SaveUserData {
  save: (data: Array<SaveUserDataInput>, path: string) => Promise<void>;
}
