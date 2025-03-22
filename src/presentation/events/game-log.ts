import type {
  SaveUserData,
  SaveUserDataInput,
} from "../../domain/usecase/save-user-data";
import { io } from "../../main/config/app";
import type { Event } from "../protocols/event";

export class GameLogEvent implements Event {
  public constructor(private readonly saveUserData: SaveUserData) {}

  public async handle(data: any): Promise<void> {
    const isBrazilianBonusTime = this.isBetween7amAnd2pm();
    const dataFormat: Array<SaveUserDataInput> = data.Players.map(
      (player: any) => ({
        name: player.Name,
        ip: player.IP,
        teamWorkScore: player.ScoreTW,
        hash: player.Hash,
        kills: player.Kills,
        deaths: player.Deaths,
        score: isBrazilianBonusTime ? player.Score * 2 : player.Score,
      })
    );
    await this.saveUserData.save(dataFormat);
    io.emit("gameLog", data);
  }

  private isBetween7amAnd2pm(): boolean {
    const brazilianTimeZone = "America/Sao_Paulo";
    const now = new Date();

    const formatter = new Intl.DateTimeFormat("pt-BR", {
      timeZone: brazilianTimeZone,
      hour: "numeric",
      hour12: false,
    });

    const currentHour = parseInt(formatter.format(now), 10);

    return currentHour >= 7 && currentHour <= 14;
  }
}
