import type {
  SaveUserData,
  SaveUserDataInput,
} from "../../domain/usecase/save-user-data";
import { io } from "../../main/config/app";
import type { Event } from "../protocols/event";

export class GameLogEvent implements Event {
  public constructor(private readonly saveUserData: SaveUserData) {}

  public async handle(data: any): Promise<void> {
    const dataFormat: Array<SaveUserDataInput> = data.Players.map(
      (player: any) => ({
        name: player.Name,
        ip: player.IP,
        teamWorkScore: player.ScoreTW,
        hash: player.Hash,
        kills: player.Kills,
        deaths: player.Deaths,
        score: player.Score,
      })
    );
    await this.saveUserData.save(dataFormat);
    io.emit("gameLog", data);
  }
}
