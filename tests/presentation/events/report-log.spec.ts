import { io } from "../../../src/main/config/app";
import { ReportLogEvent } from "../../../src/presentation/events/report-log";

jest.mock("../../../src/main/config/app", () => ({
  io: {
    emit: jest.fn(),
  },
}));

const makeSut = () => {
  const sut = new ReportLogEvent();

  return {
    sut,
  };
};

const fakeData = {
  id: "fake-id",
};

describe("ReportLog Event", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should call emit with correct values", async () => {
    const { sut } = makeSut();

    await sut.handle(fakeData);

    expect(io.emit).toHaveBeenCalledWith("reportLog", fakeData);
  });
});
