import { io } from "../../../src/main/config/app";
import { GameLogEvent } from "../../../src/presentation/events/game-log";

jest.mock("../../../src/main/config/app", () => ({
  io: {
    emit: jest.fn(),
  },
}));

const makeSut = () => {
  const sut = new GameLogEvent();

  return {
    sut,
  };
};

const fakeData = {
  id: "fake-id",
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
});
