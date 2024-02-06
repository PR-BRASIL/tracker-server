import { io } from "../../../src/main/config/app";
import { KillLogEvent } from "../../../src/presentation/events/kill-log";

jest.mock("../../../src/main/config/app", () => ({
  io: {
    emit: jest.fn(),
  },
}));

const makeSut = () => {
  const sut = new KillLogEvent();

  return {
    sut,
  };
};

const fakeData = {
  id: "fake-id",
};

describe("KillLog Event", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should call emit with correct values", async () => {
    const { sut } = makeSut();

    await sut.handle(fakeData);

    expect(io.emit).toHaveBeenCalledWith("kill", fakeData);
  });
});
