import { io } from "../../../src/main/config/app";
import { AdminLogEvent } from "../../../src/presentation/events/admin-log";

jest.mock("../../../src/main/config/app", () => ({
  io: {
    emit: jest.fn(),
  },
}));

const makeSut = () => {
  const sut = new AdminLogEvent();

  return {
    sut,
  };
};

const fakeData = {
  id: "fake-id",
};

describe("AdminLog Event", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should call emit with correct values", async () => {
    const { sut } = makeSut();

    await sut.handle(fakeData);

    expect(io.emit).toHaveBeenCalledWith("adminLog", fakeData);
  });
});
