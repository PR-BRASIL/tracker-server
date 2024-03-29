import { io } from "../../../src/main/config/app";
import { NewPlayerProfileLogEvent } from "../../../src/presentation/events/new-player-profile-log";

jest.mock("../../../src/main/config/app", () => ({
  io: {
    emit: jest.fn(),
  },
}));

const makeSut = () => {
  const sut = new NewPlayerProfileLogEvent();

  return {
    sut,
  };
};

const fakeData = {
  id: "fake-id",
};

describe("NewPlayerProfileLog Event", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should call emit with correct values", async () => {
    const { sut } = makeSut();

    await sut.handle(fakeData);

    expect(io.emit).toHaveBeenCalledWith("newPlayerProfileLog", fakeData);
  });
});
