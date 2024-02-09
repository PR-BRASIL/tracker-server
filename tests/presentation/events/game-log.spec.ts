import { SaveUserDataInput } from "../../../src/domain/usecase/save-user-data";
import { io } from "../../../src/main/config/app";
import { GameLogEvent } from "../../../src/presentation/events/game-log";

jest.mock("../../../src/main/config/app", () => ({
  io: {
    emit: jest.fn(),
  },
}));

const makeSut = () => {
  const saveUserData = {
    save: jest.fn(),
  };
  const sut = new GameLogEvent(saveUserData);

  return {
    sut,
    saveUserData,
  };
};

const fakeData = {
  Team1Name: "CHinsurgent",
  ServerName: "[PR v1.7.4.5] [BR] BRASIL EVOLUTION (TESTING)",
  MapName: "assault_on_grozny",
  Players: [
    {
      Name: "user_name",
      IP: "111.111.11.111",
      DisconnectTime: 0,
      ScoreTW: 25,
      Squad: 5,
      SquadLeader: false,
      Team: 2,
      JoinTime: 0,
      Disconnected: false,
      Hash: "d71160a8da8f4f35bc3a8fef935w7646",
      Kills: 6,
      Deaths: 1,
      VehiclesDestroyed: {},
      Score: 199,
      KitAllocations: {
        riflemanat: 2,
      },
    },
  ],
};

describe("GameLog Event", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should call emit with correct values", async () => {
    const { sut } = makeSut();

    await sut.handle(fakeData);

    expect(io.emit).toHaveBeenCalledWith("gameLog", fakeData);
  });

  test("should call saveUserData with correct values", () => {
    const { sut, saveUserData } = makeSut();

    sut.handle(fakeData);

    const dataFormat: Array<SaveUserDataInput> = fakeData.Players.map(
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

    expect(saveUserData.save).toHaveBeenCalledWith(dataFormat);
  });
});
