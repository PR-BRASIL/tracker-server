import type {
  SaveUserData,
  SaveUserDataInput,
} from "../../domain/usecase/save-user-data";
import { MongoDbClanRepository } from "../../infra/db/mongodb/repositories/mongodb-clan-repository";
import { io } from "../../main/config/app";
import { extractClanName } from "../../utils/clanUtils";
import type { Event } from "../protocols/event";

export class GameLogEvent implements Event {
  public constructor(
    private readonly saveUserData: SaveUserData,
    private readonly saveClanData: MongoDbClanRepository
  ) {}

  public async handle(data: any): Promise<void> {
    const isBrazilianBonusTime = this.isBetween7amAnd2pm();
    const dataFormat: Array<SaveUserDataInput> = data.Players.map(
      (player: any) => {
        const playTime = Math.max(0, player.DisconnectTime - player.JoinTime);

        return {
          name: player.Name,
          ip: player.IP,
          teamWorkScore: player.ScoreTW,
          hash: player.Hash,
          kills: player.Kills,
          deaths: player.Deaths,
          score: isBrazilianBonusTime ? player.Score * 2 : player.Score,
          time: playTime,
        };
      }
    );

    interface ClanData {
      name: string;
      points: number;
      membersHash: string[];
    }

    const clanData: ClanData[] = [];
    const playerHashes = new Map<string, string>(); // Map to track player hash to clan name

    for (const player of data.Players) {
      const clanName = extractClanName(player.Name);
      const playerHash = player.Hash;

      if (clanName) {
        const clan = clanData.find((c) => c.name === clanName);
        const score = isBrazilianBonusTime ? player.Score * 2 : player.Score;

        if (clan) {
          clan.points += score;
          if (!clan.membersHash.includes(playerHash)) {
            clan.membersHash.push(playerHash);
          }
        } else {
          clanData.push({
            name: clanName,
            points: score,
            membersHash: [playerHash],
          });
        }

        playerHashes.set(playerHash, clanName);
      }
    }

    // Process players who need their hash removed from other clans
    const hashRemovalPromises = [];
    for (const [playerHash, clanName] of playerHashes) {
      hashRemovalPromises.push(
        this.saveClanData.removeHashFromClan(playerHash, clanName)
      );
    }

    // Remove players not in any clan from all clans
    for (const player of data.Players) {
      if (!playerHashes.has(player.Hash)) {
        hashRemovalPromises.push(
          this.saveClanData.removeHashFromClan(player.Hash)
        );
      }
    }

    // First, wait for all hash removals to complete
    await Promise.all(hashRemovalPromises);

    // Then save clan data and user data
    await Promise.all([
      this.saveClanData.saveMany(clanData),
      this.saveUserData.save(dataFormat, data.path),
    ]);

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
