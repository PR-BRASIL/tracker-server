import { server } from "../../../src/main/config/app";
import { ChatLogEvent } from "../../../src/presentation/events/chat-log";

jest.mock("../../../src/main/config/app", () => ({
  server: {
    emit: jest.fn(),
  },
}));

const makeSut = () => {
  const sut = new ChatLogEvent();

  return {
    sut,
  };
};

const fakeData = {
  id: "fake-id",
};

describe("ChatLog Event", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should call emit with correct values", async () => {
    const { sut } = makeSut();

    await sut.handle(fakeData);

    expect(server.emit).toHaveBeenCalledWith("chat", fakeData);
  });
});
