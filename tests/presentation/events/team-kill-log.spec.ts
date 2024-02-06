import { server } from "../../../src/main/config/app";
import { TeamKillLogEvent } from "../../../src/presentation/events/team-kill-log";

jest.mock("../../../src/main/config/app", () => ({
  server: {
    emit: jest.fn(),
  },
}));

const makeSut = () => {
  const sut = new TeamKillLogEvent();

  return {
    sut,
  };
};

const fakeData = {
  id: "fake-id",
};

describe("TeamKillLog Event", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should call emit with correct values", async () => {
    const { sut } = makeSut();

    await sut.handle(fakeData);

    expect(server.emit).toHaveBeenCalledWith("teamKill", fakeData);
  });
});
