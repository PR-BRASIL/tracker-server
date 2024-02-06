import { io } from "../../../src/main/config/app";
import { TicketsLogEvent } from "../../../src/presentation/events/tickets-log";

jest.mock("../../../src/main/config/app", () => ({
  io: {
    emit: jest.fn(),
  },
}));

const makeSut = () => {
  const sut = new TicketsLogEvent();

  return {
    sut,
  };
};

const fakeData = {
  id: "fake-id",
};

describe("TicketsLog Event", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should call emit with correct values", async () => {
    const { sut } = makeSut();

    await sut.handle(fakeData);

    expect(io.emit).toHaveBeenCalledWith("ticketsLog", fakeData);
  });
});
