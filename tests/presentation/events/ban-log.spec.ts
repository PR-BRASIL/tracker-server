import { io } from "../../../src/main/config/app";
import { BanLogEvent } from "../../../src/presentation/events/ban-log";

jest.mock("../../../src/main/config/app", () => ({
  io: {
    emit: jest.fn(),
  },
}));

const makeSut = () => {
  const sut = new BanLogEvent();

  return {
    sut,
  };
};

const fakeData = {
  id: "fake-id",
};

describe("BanLog Event", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should call emit with correct values", async () => {
    const { sut } = makeSut();

    await sut.handle(fakeData);

    expect(io.emit).toHaveBeenCalledWith("banLog", fakeData);
  });
});
