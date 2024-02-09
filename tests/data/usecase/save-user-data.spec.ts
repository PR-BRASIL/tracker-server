import { io } from "../../../src/main/config/app";
import { DbSaveUserData } from "../../../src/data/usecase/save-user-data";
import { SaveUserDataInput } from "../../../src/domain/usecase/save-user-data";
const makeSut = () => {
  const saveUserDataRepository = {
    save: jest.fn(),
  };
  const sut = new DbSaveUserData(saveUserDataRepository);

  return {
    sut,
    saveUserDataRepository,
  };
};

const fakeData: Array<SaveUserDataInput> = [
  {
    name: "user_name",
    teamWorkScore: 25,
    hash: "d71160a8da8f4f35bc3a8fef935w7646",
    kills: 6,
    deaths: 1,
    score: 199,
    ip: "111.111.11.111",
  },
];

describe("AdminLog Event", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should call emit with correct values", async () => {
    const { sut, saveUserDataRepository } = makeSut();

    await sut.save(fakeData);

    expect(saveUserDataRepository.save).toHaveBeenCalledWith(fakeData);
  });
});
