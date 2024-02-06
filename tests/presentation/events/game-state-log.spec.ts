import { server } from "../../../src/main/config/app";
import { GameStateLogEvent } from "../../../src/presentation/events/game-state-log";

jest.mock("../../../src/main/config/app", () => ({
  server: {
    emit: jest.fn(),
  },
}));

const makeSut = () => {
  const sut = new GameStateLogEvent();

  return {
    sut,
  };
};

const fakeData = {
  id: "fake-id",
};

describe("GameStateLog Event", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should call emit with correct values", async () => {
    const { sut } = makeSut();

    await sut.handle(fakeData);

    expect(server.emit).toHaveBeenCalledWith("gameState", fakeData);
  });
});
