import { server } from "../../../src/main/config/app";
import { ConnectionLogEvent } from "../../../src/presentation/events/connection-log";

jest.mock("../../../src/main/config/app", () => ({
  server: {
    emit: jest.fn(),
  },
}));

const makeSut = () => {
  const sut = new ConnectionLogEvent();

  return {
    sut,
  };
};

const fakeData = {
  id: "fake-id",
};

describe("ConnectionLog Event", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should call emit with correct values", async () => {
    const { sut } = makeSut();

    await sut.handle(fakeData);

    expect(server.emit).toHaveBeenCalledWith("connectionLog", fakeData);
  });
});
